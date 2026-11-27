import { fetchDataSetMetadata, mergeMetadata } from './data-set-metadata.js'

const response = {
    dataSet: {
        id: 'ds',
        categoryCombo: { id: 'attributeCombo' },
        indicators: ['ind1'],
        sections: [{ id: 's1', indicators: ['ind2'] }],
        dataSetElements: [
            { dataElement: { id: 'de1' }, categoryCombo: { id: 'override' } },
            { dataElement: { id: 'de2' } },
        ],
    },
    dataElements: [
        {
            id: 'de1',
            categoryCombo: { id: 'combo1' },
            optionSet: { id: 'os1' },
        },
        { id: 'de2', categoryCombo: { id: 'combo1' } },
    ],
    indicators: [{ id: 'ind1' }, { id: 'ind2' }],
    categoryCombos: [
        { id: 'combo1', categories: ['cat1'] },
        { id: 'attributeCombo', categories: ['cat2'] },
    ],
    optionSets: [{ id: 'os1' }],
    categories: [
        { id: 'cat1', categoryOptions: ['co1'] },
        { id: 'cat2', categoryOptions: ['co2'] },
    ],
    categoryOptions: [{ id: 'co1' }, { id: 'co2' }],
}

const fakeEngine = () => {
    const queries = []
    return {
        queries,
        query: jest.fn(async (query) => {
            queries.push(query)
            return Object.fromEntries(
                Object.keys(query).map((name) => [
                    name,
                    name === 'dataSet'
                        ? response.dataSet
                        : { [name]: response[name] },
                ])
            )
        }),
    }
}

describe('fetchDataSetMetadata', () => {
    it('fetches everything the data set refers to, shaped like dataEntry/metadata', async () => {
        const engine = fakeEngine()
        const metadata = await fetchDataSetMetadata(engine, 'ds')

        expect(metadata).toEqual({
            dataSets: [response.dataSet],
            dataElements: response.dataElements,
            indicators: response.indicators,
            categoryCombos: response.categoryCombos,
            categories: response.categories,
            categoryOptions: response.categoryOptions,
            optionSets: response.optionSets,
        })

        const filters = Object.assign(
            {},
            ...engine.queries.flatMap((query) =>
                Object.entries(query).map(([name, { params }]) => ({
                    [name]: params.filter,
                }))
            )
        )
        expect(filters).toEqual({
            dataSet: undefined,
            dataElements: 'id:in:[de1,de2]',
            indicators: 'id:in:[ind1,ind2]',
            categoryCombos: 'id:in:[attributeCombo,combo1,override]',
            optionSets: 'id:in:[os1]',
            categories: 'id:in:[cat1,cat2]',
            categoryOptions: 'categories.id:in:[cat1,cat2]',
        })
    })

    it('does not ask for lists without ids', async () => {
        const engine = fakeEngine()
        engine.query.mockImplementationOnce(async () => ({
            dataSet: {
                ...response.dataSet,
                indicators: [],
                sections: [],
            },
        }))
        const metadata = await fetchDataSetMetadata(engine, 'ds')

        expect(metadata.indicators).toEqual([])
        expect(engine.queries.some((query) => 'indicators' in query)).toBe(
            false
        )
    })
})

describe('mergeMetadata', () => {
    it('adds what is missing and keeps everything else', () => {
        expect(
            mergeMetadata(
                {
                    dataSets: [{ id: 'writable' }],
                    categoryCombos: [{ id: 'default', name: 'kept' }],
                    optionSets: [{ id: 'os' }],
                },
                {
                    dataSets: [{ id: 'readable' }],
                    categoryCombos: [{ id: 'default', name: 'added' }],
                }
            )
        ).toEqual({
            dataSets: [{ id: 'writable' }, { id: 'readable' }],
            categoryCombos: [{ id: 'default', name: 'kept' }],
            optionSets: [{ id: 'os' }],
        })
    })
})
