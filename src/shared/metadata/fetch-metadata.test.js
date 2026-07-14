import { fetchMetadata } from './fetch-metadata.js'

/*
 * A mock @dhis2/app-runtime data engine that serves per-type fixtures from an
 * in-memory "database", honouring the `filter: id:in:[...]` and returning the
 * requested `fields` faithfully enough for the assembly logic. It records every
 * request so tests can assert on query count / chunking.
 */
const createMockEngine = (db) => {
    const calls = []

    const query = (queries) => {
        const result = {}
        for (const [name, def] of Object.entries(queries)) {
            const { resource, params = {} } = def
            calls.push({ resource, params })

            let rows = db[resource] ?? []

            // Apply `id:in:[...]` filter if present.
            const filter = params.filter
            if (filter && filter.startsWith('id:in:[')) {
                const ids = filter
                    .slice('id:in:['.length, -1)
                    .split(',')
                    .filter(Boolean)
                const idSet = new Set(ids)
                rows = rows.filter((row) => idSet.has(row.id))
            }

            result[name] = { [resource]: rows }
        }
        return Promise.resolve(result)
    }

    return { engine: { query }, calls }
}

describe('fetchMetadata', () => {
    /*
     * Fixture graph:
     *
     *   dataSets:
     *     ds_write  (access.data.write=true)  -> keep
     *     ds_read   (access.data.write=false) -> drop (read-only)
     *
     *   ds_write:
     *     categoryCombo: cc_attr           (attribute combo, no COCs)
     *     dataSetElements:
       *       de1 (no override -> uses de1.categoryCombo = cc_de)
     *       de2 (override -> cc_override)
     *     indicators: [ind1]
     *
     *   de1.categoryCombo = cc_de   (data-element combo, has COCs)
     *   de1.optionSet = os1, de1.commentOptionSet = os2
     *   de2.categoryCombo = cc_de
     *
     *   cc_de       -> categories [cat_de]
     *   cc_override -> categories [cat_de]
     *   cc_attr     -> categories [cat_attr]
     *
     *   cat_de   -> categoryOptions [co_de]        (data-element category: no ACL)
     *   cat_attr -> categoryOptions [co_attr_ok, co_attr_no]  (attribute: ACL applies)
     *
     *   co_attr_ok.access.data.write = true  -> keep
     *   co_attr_no.access.data.write = false -> drop
     */
    const buildDb = () => ({
        dataSets: [
            {
                id: 'ds_write',
                displayName: 'Writable',
                categoryCombo: { id: 'cc_attr' },
                organisationUnits: ['ou1'],
                indicators: ['ind1'],
                dataSetElements: [
                    { dataElement: { id: 'de1' } },
                    {
                        dataElement: { id: 'de2' },
                        categoryCombo: { id: 'cc_override' },
                    },
                ],
                access: { data: { write: true } },
            },
            {
                id: 'ds_read',
                displayName: 'Read only',
                categoryCombo: { id: 'cc_attr' },
                organisationUnits: ['ou1'],
                indicators: ['ind_read'],
                dataSetElements: [{ dataElement: { id: 'de_read' } }],
                access: { data: { write: false } },
            },
        ],
        dataElements: [
            {
                id: 'de1',
                displayName: 'DE 1',
                categoryCombo: { id: 'cc_de' },
                optionSet: { id: 'os1' },
                commentOptionSet: { id: 'os2' },
            },
            { id: 'de2', displayName: 'DE 2', categoryCombo: { id: 'cc_de' } },
            { id: 'de_read', displayName: 'should not be fetched' },
        ],
        indicators: [
            { id: 'ind1', displayName: 'Ind 1' },
            { id: 'ind_read', displayName: 'should not be fetched' },
        ],
        categoryCombos: [
            {
                id: 'cc_de',
                isDefault: false,
                categories: ['cat_de'],
                categoryOptionCombos: [{ id: 'coc_de' }],
            },
            {
                id: 'cc_override',
                isDefault: false,
                categories: ['cat_de'],
                categoryOptionCombos: [{ id: 'coc_override' }],
            },
            { id: 'cc_attr', isDefault: false, categories: ['cat_attr'] },
        ],
        categories: [
            { id: 'cat_de', categoryOptions: ['co_de'] },
            { id: 'cat_attr', categoryOptions: ['co_attr_ok', 'co_attr_no'] },
        ],
        categoryOptions: [
            { id: 'co_de', displayName: 'Opt DE' },
            {
                id: 'co_attr_ok',
                displayName: 'Opt attr ok',
                access: { data: { write: true } },
            },
            {
                id: 'co_attr_no',
                displayName: 'Opt attr no',
                access: { data: { write: false } },
            },
        ],
        optionSets: [
            { id: 'os1', options: [{ id: 'opt1' }] },
            { id: 'os2', options: [{ id: 'opt2' }] },
        ],
    })

    it('keeps only data sets the user can write, and strips the access field', async () => {
        const { engine } = createMockEngine(buildDb())
        const result = await fetchMetadata(engine)

        expect(result.dataSets.map((ds) => ds.id)).toEqual(['ds_write'])
        expect(result.dataSets[0]).not.toHaveProperty('access')
    })

    it('builds the transitive closure and dedups, excluding the read-only branch', async () => {
        const { engine } = createMockEngine(buildDb())
        const result = await fetchMetadata(engine)

        expect(result.dataElements.map((de) => de.id).sort()).toEqual([
            'de1',
            'de2',
        ])
        expect(result.indicators.map((i) => i.id)).toEqual(['ind1'])
        // cc_de + cc_override (data-element combos) + cc_attr (attribute combo)
        expect(result.categoryCombos.map((cc) => cc.id).sort()).toEqual([
            'cc_attr',
            'cc_de',
            'cc_override',
        ])
        expect(result.categories.map((c) => c.id).sort()).toEqual([
            'cat_attr',
            'cat_de',
        ])
        expect(result.optionSets.map((os) => os.id).sort()).toEqual([
            'os1',
            'os2',
        ])
        // de_read / ind_read must never be fetched
        expect(result.dataElements.map((de) => de.id)).not.toContain('de_read')
    })

    it('includes per-data-set-element categoryCombo overrides as data-element combos (with COCs)', async () => {
        const { engine } = createMockEngine(buildDb())
        const result = await fetchMetadata(engine)

        const override = result.categoryCombos.find(
            (cc) => cc.id === 'cc_override'
        )
        expect(override).toBeDefined()
        expect(override.categoryOptionCombos).toBeDefined()
    })

    it('applies data-write ACL only to attribute-category options, keeps data-element options unconditionally', async () => {
        const { engine } = createMockEngine(buildDb())
        const result = await fetchMetadata(engine)

        const optionIds = result.categoryOptions.map((co) => co.id).sort()
        // co_de: data-element category option -> kept regardless of access
        // co_attr_ok: attribute option with write access -> kept
        // co_attr_no: attribute option without write access -> dropped
        expect(optionIds).toEqual(['co_attr_ok', 'co_de'])
        result.categoryOptions.forEach((co) =>
            expect(co).not.toHaveProperty('access')
        )
    })

    it('an attribute option is kept regardless of access when it also belongs to a data-element category', async () => {
        const db = buildDb()
        // Make the data-element category also reference the un-writable attr option.
        db.categories.find((c) => c.id === 'cat_de').categoryOptions = [
            'co_de',
            'co_attr_no',
        ]
        const { engine } = createMockEngine(db)
        const result = await fetchMetadata(engine)

        expect(result.categoryOptions.map((co) => co.id)).toContain('co_attr_no')
    })

    it('returns the seven expected top-level arrays', async () => {
        const { engine } = createMockEngine(buildDb())
        const result = await fetchMetadata(engine)

        expect(Object.keys(result).sort()).toEqual([
            'categories',
            'categoryCombos',
            'categoryOptions',
            'dataElements',
            'dataSets',
            'indicators',
            'optionSets',
        ])
    })

    it('issues no request for a type when the closure yields no ids of that type', async () => {
        const db = buildDb()
        // Remove all indicators from the writable data set.
        db.dataSets.find((ds) => ds.id === 'ds_write').indicators = []
        const { engine, calls } = createMockEngine(db)
        await fetchMetadata(engine)

        expect(calls.some((c) => c.resource === 'indicators')).toBe(false)
    })

    it('chunks large id filters into multiple bounded requests', async () => {
        const db = buildDb()
        // 250 data elements referenced by the writable data set -> 2 chunks of 200.
        const manyDes = Array.from({ length: 250 }, (_, i) => ({
            id: `de_bulk_${i}`,
            displayName: `Bulk ${i}`,
            categoryCombo: { id: 'cc_de' },
        }))
        db.dataElements.push(...manyDes)
        db.dataSets.find((ds) => ds.id === 'ds_write').dataSetElements = manyDes.map(
            (de) => ({ dataElement: { id: de.id } })
        )
        const { engine, calls } = createMockEngine(db)
        const result = await fetchMetadata(engine)

        const dataElementCalls = calls.filter((c) => c.resource === 'dataElements')
        expect(dataElementCalls.length).toBe(2)
        expect(result.dataElements.length).toBe(250)
    })
})
