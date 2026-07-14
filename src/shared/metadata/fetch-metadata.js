/*
 * Client-side replacement for the bespoke `GET /api/dataEntry/metadata` endpoint.
 *
 * That endpoint walks the whole metadata entity-graph via lazy Hibernate
 * associations, which triggers an N+1 query explosion (thousands of SQL
 * statements) on large instances. Instead of one call to that endpoint, this
 * module fetches each metadata type FLAT and IN BULK from the standard,
 * cache-friendly metadata endpoints and stitches the result together on the
 * client into the exact same shape the app already consumes.
 *
 * Both endpoints share the server's `FieldFilterService`, so we reuse the
 * endpoint's original `fields=` strings verbatim: the per-type JSON is then
 * produced by the same code path and is field-for-field identical. The four
 * jobs the bespoke endpoint did that we must reproduce here are:
 *
 *   1. Transitive closure + dedup  — walk data sets -> elements -> combos ->
 *      categories -> options -> option-combos -> option-sets and return seven
 *      de-duplicated arrays. We do this by collecting ids at each stage and
 *      fetching the next type by id (chunked to keep URLs bounded).
 *   2. Data-write ACL filtering    — the endpoint only returns data sets (and
 *      attribute category-options) the user may WRITE. Standard endpoints
 *      default to READ sharing, so we request the computed `access` field and
 *      filter on `access.data.write` client-side, then strip `access` again.
 *   3. Org-unit associations       — `organisationUnits~pluck[id]` on the data
 *      set, matching the endpoint's association output.
 *   4. Server-computed fields      — the endpoint populates the transient
 *      `explodedNumerator/Denominator` on indicators. This app renders
 *      indicators from the raw `numerator`/`denominator` and never reads the
 *      exploded fields, so we intentionally skip that computation.
 *
 * See DHIS2-21757.
 */

// Field-filter strings, copied from the server's
// DefaultDataSetMetadataExportService so the per-type JSON matches exactly.
//
// `!href` is appended to each string: the standard list endpoints inject an
// `href` link that the bespoke endpoint does not, so we exclude it to keep the
// output byte-identical (the app never reads it).
const FIELDS_DATA_SETS =
    ':simple,!href,categoryCombo[id],formType,dataEntryForm[id],' +
    'dataInputPeriods[period,openingDate,closingDate],' +
    'indicators~pluck[id],' +
    'compulsoryDataElementOperands[dataElement[id],categoryOptionCombo[id]],' +
    'sections[:simple,displayOptions,dataElements~pluck[id],indicators~pluck[id],' +
    'greyedFields[dataElement[id],categoryOptionCombo[id]]],' +
    // added by the endpoint after field-filtering; requested directly here:
    'dataSetElements[dataElement[id],categoryCombo[id]],' +
    'organisationUnits~pluck[id]'

const FIELDS_DATA_ELEMENTS =
    ':identifiable,!href,displayName,displayShortName,displayFormName,' +
    'zeroIsSignificant,valueType,aggregationType,categoryCombo[id],optionSet[id],' +
    'commentOptionSet,description'

// The bespoke endpoint additionally populates the transient
// `explodedNumerator`/`explodedDenominator` via ExpressionService. The standard
// /api/indicators endpoint does not compute them, and this app renders
// indicators from the raw `numerator`/`denominator` (indicators-table-body.jsx)
// and never reads the exploded fields, so we intentionally omit them.
const FIELDS_INDICATORS = ':simple,!href,indicatorType[factor]'

const FIELDS_DATA_ELEMENT_CAT_COMBOS =
    ':simple,!href,isDefault,categories~pluck[id],' +
    'categoryOptionCombos[id,code,name,displayName,categoryOptions~pluck[id]]'

const FIELDS_DATA_SET_CAT_COMBOS =
    ':simple,!href,isDefault,categories~pluck[id]'

const FIELDS_CATEGORIES = ':simple,!href,categoryOptions~pluck[id]'

const FIELDS_CATEGORY_OPTIONS = ':simple,!href,organisationUnits~pluck[id]'

const FIELDS_OPTION_SETS = ':simple,!href,options[id,code,displayName]'

// Max number of ids per `id:in:[...]` filter, to keep request URLs well under
// the servlet container's header-size limit (~8KB). 200 ids * ~12 chars is
// comfortably below that.
const ID_CHUNK_SIZE = 200

const chunk = (array, size) => {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

const uniq = (array) => Array.from(new Set(array))

/**
 * Fetch every object of `resource` matching the given `ids`, flat and in bulk,
 * chunking the id filter across multiple requests and concatenating the result.
 * Returns [] when there are no ids (issues no request).
 */
const fetchByIds = async (engine, resource, ids, fields) => {
    if (!ids.length) {
        return []
    }
    const chunks = chunk(ids, ID_CHUNK_SIZE)
    const responses = await Promise.all(
        chunks.map((idChunk) =>
            engine.query({
                [resource]: {
                    resource,
                    params: {
                        fields,
                        filter: `id:in:[${idChunk.join(',')}]`,
                        paging: false,
                    },
                },
            })
        )
    )
    return responses.flatMap((response) => response[resource][resource])
}

const canDataWrite = (object) => object?.access?.data?.write === true

// The `access` field is only requested so we can apply data-write filtering;
// it is not part of the endpoint's response, so strip it before assembling.
const stripAccess = (object) => {
    const rest = { ...object }
    delete rest.access
    return rest
}

/**
 * Reproduce `GET /api/dataEntry/metadata` using flat, per-type requests to the
 * standard metadata endpoints. Returns the same seven-array object the endpoint
 * returns (before the client-side `hashArraysInObject` transform).
 *
 * @param {object} engine an @dhis2/app-runtime data engine
 * @returns {Promise<object>} { dataSets, dataElements, indicators,
 *   categoryCombos, categories, categoryOptions, optionSets }
 */
export const fetchMetadata = async (engine) => {
    // --- Stage 1: writable data sets (the roots of the closure) --------------
    // Request `access` so we can keep only data sets the user may write, exactly
    // as the endpoint's getDataWriteAll(DataSet.class) does.
    const dataSetsResponse = await engine.query({
        dataSets: {
            resource: 'dataSets',
            params: {
                fields: `${FIELDS_DATA_SETS},access`,
                paging: false,
            },
        },
    })
    const dataSets = dataSetsResponse.dataSets.dataSets
        .filter(canDataWrite)
        .map(stripAccess)

    // Ids reachable directly from the writable data sets.
    const dataElementIds = uniq(
        dataSets.flatMap((ds) =>
            (ds.dataSetElements ?? []).map((dse) => dse.dataElement.id)
        )
    )
    const indicatorIds = uniq(dataSets.flatMap((ds) => ds.indicators ?? []))
    // Per-data-set-element categoryCombo overrides (a data element's combo can
    // be overridden per data set). These belong to the "data element" combo set.
    const overrideCategoryComboIds = uniq(
        dataSets.flatMap((ds) =>
            (ds.dataSetElements ?? [])
                .map((dse) => dse.categoryCombo?.id)
                .filter(Boolean)
        )
    )
    // Each data set's own (attribute) categoryCombo.
    const dataSetCategoryComboIds = uniq(
        dataSets.map((ds) => ds.categoryCombo?.id).filter(Boolean)
    )

    // --- Stage 2: data elements & indicators (fetched by id, in parallel) ----
    const [dataElements, indicators] = await Promise.all([
        fetchByIds(engine, 'dataElements', dataElementIds, FIELDS_DATA_ELEMENTS),
        fetchByIds(engine, 'indicators', indicatorIds, FIELDS_INDICATORS),
    ])

    // A data element's category combos = its own combo + any per-data-set
    // overrides (matches DataElement.getCategoryCombos() server-side).
    const dataElementOwnCategoryComboIds = dataElements
        .map((de) => de.categoryCombo?.id)
        .filter(Boolean)
    const dataElementCategoryComboIds = uniq([
        ...dataElementOwnCategoryComboIds,
        ...overrideCategoryComboIds,
    ])

    // Option sets referenced by data elements (value option set + comment
    // option set), matching the endpoint's getOptionSets(dataElements).
    const optionSetIds = uniq(
        dataElements.flatMap((de) =>
            [de.optionSet?.id, de.commentOptionSet?.id].filter(Boolean)
        )
    )

    // --- Stage 3: category combos --------------------------------------------
    // Data-element combos carry their categoryOptionCombos; attribute (data set)
    // combos do not. A combo used by both is emitted once, in the data-element
    // group (the richer field set), exactly like the endpoint's removeAll().
    const dataSetOnlyCategoryComboIds = dataSetCategoryComboIds.filter(
        (id) => !dataElementCategoryComboIds.includes(id)
    )
    const [dataElementCategoryCombos, dataSetOnlyCategoryCombos] =
        await Promise.all([
            fetchByIds(
                engine,
                'categoryCombos',
                dataElementCategoryComboIds,
                FIELDS_DATA_ELEMENT_CAT_COMBOS
            ),
            fetchByIds(
                engine,
                'categoryCombos',
                dataSetOnlyCategoryComboIds,
                FIELDS_DATA_SET_CAT_COMBOS
            ),
        ])
    const categoryCombos = [
        ...dataElementCategoryCombos,
        ...dataSetOnlyCategoryCombos,
    ]

    // --- Stage 4: categories --------------------------------------------------
    // Categories reached via data-element combos vs. via data set (attribute)
    // combos are treated differently for category-option ACL (see stage 5), so
    // track the two sets separately. Note: the data set category set uses the
    // FULL set of data set combos (before the removeAll above), matching the
    // server, where dataSetCategories is computed before dataSetCategoryCombos
    // has the data-element combos removed.
    const categoriesOf = (combos) =>
        uniq(combos.flatMap((cc) => cc.categories ?? []))

    const dataElementCategoryIds = categoriesOf(dataElementCategoryCombos)
    // For the attribute combos, look up each combo's categories from whichever
    // group it was fetched in (a combo may be shared).
    const categoryComboById = new Map(
        categoryCombos.map((cc) => [cc.id, cc])
    )
    const dataSetCategoryIds = uniq(
        dataSetCategoryComboIds.flatMap(
            (id) => categoryComboById.get(id)?.categories ?? []
        )
    )
    const categoryIds = uniq([
        ...dataElementCategoryIds,
        ...dataSetCategoryIds,
    ])

    const categories = await fetchByIds(
        engine,
        'categories',
        categoryIds,
        FIELDS_CATEGORIES
    )

    // --- Stage 5: category options (with data-write ACL) ---------------------
    // Options of data-element categories are included unconditionally; options
    // of data set (attribute) categories are included only if the user may
    // write them (getDataWriteCategoryOptions server-side).
    const categoryById = new Map(categories.map((c) => [c.id, c]))
    const optionsOf = (ids) =>
        ids.flatMap((id) => categoryById.get(id)?.categoryOptions ?? [])

    const dataElementOptionIds = new Set(optionsOf(dataElementCategoryIds))
    const dataSetOptionIds = new Set(optionsOf(dataSetCategoryIds))
    const allOptionIds = uniq([...dataElementOptionIds, ...dataSetOptionIds])

    const fetchedOptions = await fetchByIds(
        engine,
        'categoryOptions',
        allOptionIds,
        `${FIELDS_CATEGORY_OPTIONS},access`
    )
    const categoryOptions = fetchedOptions
        .filter(
            (option) =>
                dataElementOptionIds.has(option.id) || canDataWrite(option)
        )
        .map(stripAccess)

    // --- Stage 6: option sets -------------------------------------------------
    const optionSets = await fetchByIds(
        engine,
        'optionSets',
        optionSetIds,
        FIELDS_OPTION_SETS
    )

    return {
        dataSets,
        dataElements,
        indicators,
        categoryCombos,
        categories,
        categoryOptions,
        optionSets,
    }
}
