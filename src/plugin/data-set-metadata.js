/*
 * dataEntry/metadata only has the data sets the user can enter data for, so a
 * readable one is fetched from the regular API with the same fields
 * (DefaultDataSetMetadataExportService in dhis2-core).
 */

// data queries can't use field groups such as :simple
const fields = (...names) => names.join(',')

const IDENTIFIABLE = fields('id', 'code', 'name', 'created', 'lastUpdated')
const NAMES = fields('displayName', 'displayShortName', 'displayFormName')

const FIELDS_SECTIONS = fields(
    IDENTIFIABLE,
    'description',
    'displayName',
    'displayOptions',
    'sortOrder',
    'showRowTotals',
    'showColumnTotals',
    'disableDataElementAutoGroup',
    'dataElements~pluck[id]',
    'indicators~pluck[id]',
    'greyedFields[dataElement[id],categoryOptionCombo[id]]'
)

const FIELDS_DATA_SETS = fields(
    IDENTIFIABLE,
    NAMES,
    'shortName',
    'description',
    'displayOptions',
    'periodType',
    'formType',
    'version',
    'mobile',
    'expiryDays',
    'timelyDays',
    'openFuturePeriods',
    'openPeriodsAfterCoEndDate',
    'notifyCompletingUser',
    'fieldCombinationRequired',
    'validCompleteOnly',
    'noValueRequiresComment',
    'skipOffline',
    'dataElementDecoration',
    'renderAsTabs',
    'renderHorizontally',
    'compulsoryFieldsCompleteOnly',
    'dimensionItem',
    'dimensionItemType',
    'categoryCombo[id]',
    'dataEntryForm[id]',
    'dataInputPeriods[period,openingDate,closingDate]',
    'indicators~pluck[id]',
    'compulsoryDataElementOperands[dataElement[id],categoryOptionCombo[id]]',
    `sections[${FIELDS_SECTIONS}]`,
    'dataSetElements[dataElement[id],categoryCombo[id]]',
    'organisationUnits~pluck[id]'
)

const FIELDS_DATA_ELEMENTS = fields(
    IDENTIFIABLE,
    NAMES,
    'description',
    'zeroIsSignificant',
    'valueType',
    'aggregationType',
    'categoryCombo[id]',
    'optionSet[id]',
    'commentOptionSet[id]'
)

// not explodedNumerator/Denominator: only dataEntry/metadata fills them in
const FIELDS_INDICATORS = fields(
    IDENTIFIABLE,
    NAMES,
    'shortName',
    'description',
    'displayDescription',
    'annualized',
    'numerator',
    'numeratorDescription',
    'displayNumeratorDescription',
    'denominator',
    'denominatorDescription',
    'displayDenominatorDescription',
    'indicatorType[factor]',
    'url',
    'dimensionItem',
    'dimensionItemType'
)

const FIELDS_CATEGORY_COMBOS = fields(
    IDENTIFIABLE,
    'displayName',
    'dataDimensionType',
    'skipTotal',
    'isDefault',
    'categories~pluck[id]',
    'categoryOptionCombos[id,code,name,displayName,categoryOptions~pluck[id]]'
)

const FIELDS_CATEGORIES = fields(
    IDENTIFIABLE,
    'shortName',
    'displayName',
    'displayShortName',
    'dataDimensionType',
    'dataDimension',
    'dimension',
    'allItems',
    'isDefault',
    'categoryOptions~pluck[id]'
)

const FIELDS_CATEGORY_OPTIONS = fields(
    IDENTIFIABLE,
    NAMES,
    'shortName',
    'startDate',
    'endDate',
    'isDefault',
    'dimensionItem',
    'dimensionItemType',
    'organisationUnits~pluck[id]'
)

const FIELDS_OPTION_SETS = fields(
    IDENTIFIABLE,
    'displayName',
    'valueType',
    'version',
    'options[id,code,displayName]'
)

const unique = (ids) => [...new Set(ids.filter(Boolean))]

const queryLists = async (engine, lists) => {
    const queries = Object.entries(lists).filter(([, { ids }]) => ids.length)
    const response = await engine.query(
        Object.fromEntries(
            queries.map(([resource, { ids, fields, filterBy = 'id' }]) => [
                resource,
                {
                    resource,
                    params: {
                        paging: false,
                        fields,
                        filter: `${filterBy}:in:[${ids.join(',')}]`,
                    },
                },
            ])
        )
    )
    return Object.fromEntries(
        Object.keys(lists).map((name) => [name, response[name]?.[name] ?? []])
    )
}

export const fetchDataSetMetadata = async (engine, dataSetId) => {
    const { dataSet } = await engine.query({
        dataSet: {
            resource: 'dataSets',
            id: dataSetId,
            params: { fields: FIELDS_DATA_SETS },
        },
    })

    const { dataElements, indicators } = await queryLists(engine, {
        dataElements: {
            ids: unique(
                dataSet.dataSetElements.map(({ dataElement }) => dataElement.id)
            ),
            fields: FIELDS_DATA_ELEMENTS,
        },
        indicators: {
            ids: unique([
                ...dataSet.indicators,
                ...dataSet.sections.flatMap((section) => section.indicators),
            ]),
            fields: FIELDS_INDICATORS,
        },
    })

    // the attribute combo keeps its option combos too, so the default combo
    // can't miss its own
    const { categoryCombos, optionSets } = await queryLists(engine, {
        categoryCombos: {
            ids: unique([
                dataSet.categoryCombo?.id,
                ...dataElements.map((de) => de.categoryCombo?.id),
                ...dataSet.dataSetElements.map((dse) => dse.categoryCombo?.id),
            ]),
            fields: FIELDS_CATEGORY_COMBOS,
        },
        optionSets: {
            ids: unique(
                dataElements.flatMap((de) => [
                    de.optionSet?.id,
                    de.commentOptionSet?.id,
                ])
            ),
            fields: FIELDS_OPTION_SETS,
        },
    })

    const { categories } = await queryLists(engine, {
        categories: {
            ids: unique(categoryCombos.flatMap((cc) => cc.categories)),
            fields: FIELDS_CATEGORIES,
        },
    })

    const { categoryOptions } = await queryLists(engine, {
        categoryOptions: {
            // a category can have many options, so by category
            ids: categories.map(({ id }) => id),
            filterBy: 'categories.id',
            fields: FIELDS_CATEGORY_OPTIONS,
        },
    })

    return {
        dataSets: [dataSet],
        dataElements,
        indicators,
        categoryCombos,
        categories,
        categoryOptions,
        optionSets,
    }
}

export const mergeMetadata = (metadata, addition) => ({
    ...metadata,
    ...Object.fromEntries(
        Object.entries(addition).map(([type, items]) => {
            const existing = metadata[type] ?? []
            const ids = new Set(existing.map(({ id }) => id))
            return [
                type,
                [...existing, ...items.filter(({ id }) => !ids.has(id))],
            ]
        })
    ),
})
