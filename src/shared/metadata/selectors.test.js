import {
    getCategories,
    getCategoriesByCategoryComboId,
    getCategoriesByDataSetId,
    getCategoryById,
    getCategoryComboByDataSetId,
    getCategoryComboById,
    getCategoryCombos,
    getCategoryOptionCombosByCategoryComboId,
    getCategoryOptions,
    getCategoryOptionsByCategoryId,
    getCategoryOptionsByCategoryOptionComboId,
    getCategoriesWithOptionsWithinPeriod,
    getCoCByCategoryOptions,
    getDataElements,
    getDataElementsByDataSetId,
    getDataElementsBySection,
    getDataSetById,
    getDataSets,
    getGroupedDataElementsByCatCombo,
    getGroupedDataElementsByCatComboInOrder,
    getSections,
    getDataElementsByDataSetIdSorted,
} from './selectors.js'

describe('simple selectors', () => {
    describe('getCategories', () => {
        it('returns the expected data', () => {
            const expected = 'expected'
            const data = { categories: expected }

            expect(getCategories(data)).toBe(expected)
        })
    })

    describe('getCategoryCombos', () => {
        it('returns the expected data', () => {
            const expected = 'expected'
            const data = { categoryCombos: expected }

            expect(getCategoryCombos(data)).toBe(expected)
        })
    })

    describe('getCategoryOptions', () => {
        it('returns the expected data', () => {
            const expected = 'expected'
            const data = { categoryOptions: expected }

            expect(getCategoryOptions(data)).toBe(expected)
        })
    })

    describe('getDataElements', () => {
        it('returns the expected data', () => {
            const expected = 'expected'
            const data = { dataElements: expected }

            expect(getDataElements(data)).toBe(expected)
        })
    })

    describe('getDataSets', () => {
        it('returns the expected data', () => {
            const expected = 'expected'
            const data = { dataSets: expected }

            expect(getDataSets(data)).toBe(expected)
        })
    })

    describe('getSections', () => {
        it('returns the expected data', () => {
            const expected = 'expected'
            const data = { sections: expected }

            expect(getSections(data)).toBe(expected)
        })
    })
})

describe('simple selectors that select by id', () => {
    describe('getCategoryById', () => {
        it('returns the expected data', () => {
            const id = 'id'
            const expected = 'expected'
            const data = {
                categories: {
                    [id]: expected,
                },
            }

            expect(getCategoryById(data, id)).toBe(expected)
        })
    })

    describe('getDataSetById', () => {
        it('returns the expected data', () => {
            const id = 'id'
            const expected = 'expected'
            const data = {
                dataSets: {
                    [id]: expected,
                },
            }

            expect(getDataSetById(data, id)).toBe(expected)
        })
    })

    describe('getCategoryComboById', () => {
        it('returns the expected data', () => {
            const id = 'id'
            const expected = 'expected'
            const data = {
                categoryCombos: {
                    [id]: expected,
                },
            }

            expect(getCategoryComboById(data, id)).toBe(expected)
        })
    })
})

describe('complex selectors that select by id', () => {
    describe('getCategoriesByCategoryComboId', () => {
        it('returns the expected data', () => {
            const categoryComboId = 'categoryComboId'
            const categoryId = 'categoryId'
            const category = { id: categoryId }
            const expected = [category]
            const data = {
                categoryCombos: {
                    [categoryComboId]: {
                        categories: [categoryId],
                    },
                },
                categories: {
                    [categoryId]: category,
                },
            }

            expect(
                getCategoriesByCategoryComboId(data, categoryComboId)
            ).toEqual(expected)
        })
    })

    describe('getCategoryOptionsByCategoryId', () => {
        it('returns the expected data', () => {
            const categoryId = 'categoryId'
            const categoryOptionId = 'categoryOptionId'
            const categoryOption = { id: categoryOptionId }
            const expected = [categoryOption]
            const data = {
                categoryOptions: {
                    [categoryOptionId]: categoryOption,
                },
                categories: {
                    [categoryId]: {
                        categoryOptions: [categoryOptionId],
                    },
                },
            }

            expect(getCategoryOptionsByCategoryId(data, categoryId)).toEqual(
                expected
            )
        })
    })

    describe('getCategoryOptionCombosByCategoryComboId', () => {
        it('returns the expected data', () => {
            const categoryComboId = 'categoryComboId'
            const categoryOptionCombo = {
                id: 'id',
            }
            const expected = [categoryOptionCombo]
            const data = {
                categoryCombos: {
                    [categoryComboId]: {
                        categoryOptionCombos: [categoryOptionCombo],
                    },
                },
            }

            expect(
                getCategoryOptionCombosByCategoryComboId(data, categoryComboId)
            ).toEqual(expected)
        })

        it('returns undefined if there is no categoryCombo', () => {
            const categoryComboId = 'categoryComboId'
            const data = {
                categoryCombos: {},
            }

            expect(
                getCategoryOptionCombosByCategoryComboId(data, categoryComboId)
            ).toBeNull()
        })
    })

    describe('getDataElementsByDataSetId', () => {
        it('returns undefined when there is no matching dataSet', () => {
            const dataSetId = 'dataSetId'
            const data = {
                dataSets: {},
            }

            expect(getDataElementsByDataSetId(data, dataSetId)).toBeUndefined()
        })

        it('returns undefined when there are no dataSetElements', () => {
            const dataSetId = 'dataSetId'
            const data = {
                dataSets: {
                    [dataSetId]: {},
                },
            }

            expect(getDataElementsByDataSetId(data, dataSetId)).toBeUndefined()
        })

        it('returns the expected data elements when there is no dataset categorycombo override', () => {
            const dataSetId = 'dataSetId'
            const dataElementId = 'dataElementId'
            const dataSetElement = {
                dataElement: {
                    id: dataElementId,
                },
            }
            const dataElement = {
                id: dataElementId,
                categoryCombo: 'dataElementCategoryCombo',
            }
            const expected = [dataElement]
            const data = {
                dataSets: {
                    [dataSetId]: {
                        dataSetElements: [dataSetElement],
                    },
                },
                dataElements: {
                    [dataElementId]: dataElement,
                },
            }

            expect(getDataElementsByDataSetId(data, dataSetId)).toEqual(
                expected
            )
        })

        it('returns the expected data elements when there is a dataset categorycombo override', () => {
            const dataSetId = 'dataSetId'
            const dataElementId = 'dataElementId'
            const dataSetElement = {
                categoryCombo: 'dataSetElementCategoryCombo',
                dataElement: {
                    id: dataElementId,
                },
            }
            const dataElement = {
                id: dataElementId,
                categoryCombo: 'dataElementCategoryCombo',
            }
            const expected = [
                {
                    ...dataElement,
                    categoryCombo: dataSetElement.categoryCombo,
                },
            ]
            const data = {
                dataSets: {
                    [dataSetId]: {
                        dataSetElements: [dataSetElement],
                    },
                },
                dataElements: {
                    [dataElementId]: dataElement,
                },
            }

            expect(getDataElementsByDataSetId(data, dataSetId)).toEqual(
                expected
            )
        })
    })

    describe('getDataElementsByDataSetIdSorted', () => {
        it('returns data elements sorted in order of displayFormName', () => {
            const dataSetId = 'dataSetId'

            const createDataSetElement = (id) => ({
                categoryCombo: 'categoryCombo',
                dataElement: {
                    id,
                },
            })

            const createDataElement = (
                id,
                displayFormName,
                categoryCombo = 'dataElementCategoryCombo'
            ) => ({
                id,
                displayFormName,
                categoryCombo,
            })

            const data = {
                dataSets: {
                    [dataSetId]: {
                        dataSetElements: [
                            createDataSetElement('id1'),
                            createDataSetElement('id2'),
                            createDataSetElement('id3'),
                            createDataSetElement('id4'),
                        ],
                    },
                },
                dataElements: {
                    id1: createDataElement('id1', 'Beta'),
                    id2: createDataElement('id2', 'Alpha'),
                    id3: createDataElement('id3', 'Gamma'),
                    id4: createDataElement('id4', 'Delta'),
                },
            }

            const expected = [
                createDataElement('id2', 'Alpha', 'categoryCombo'),
                createDataElement('id1', 'Beta', 'categoryCombo'),
                createDataElement('id4', 'Delta', 'categoryCombo'),
                createDataElement('id3', 'Gamma', 'categoryCombo'),
            ]

            expect(getDataElementsByDataSetIdSorted(data, dataSetId)).toEqual(
                expected
            )
        })
    })

    describe('getDataElementsBySection', () => {
        it('returns the expected data', () => {
            const dataSetId = 'dataSetId'
            const sectionId = 'sectionId'
            const dataElementId = 'dataElementId'
            const dataSetElement = {
                categoryCombo: 'dataSetElementCategoryCombo',
                dataElement: {
                    id: dataElementId,
                },
            }
            const dataElement = {
                id: dataElementId,
                categoryCombo: 'dataElementCategoryCombo',
            }
            const section = {
                id: sectionId,
                dataElements: [dataElementId],
            }
            const expected = [
                {
                    ...dataElement,
                    categoryCombo: dataSetElement.categoryCombo,
                },
            ]
            const data = {
                dataElements: {
                    [dataElementId]: dataElement,
                },
                dataSets: {
                    [dataSetId]: {
                        dataSetElements: [dataSetElement],
                        sections: [section],
                    },
                },
            }

            expect(
                getDataElementsBySection(data, dataSetId, sectionId)
            ).toEqual(expected)
        })
    })

    describe('getCategoryComboByDataSetId', () => {
        let consoleWarnSpy

        beforeAll(() => {
            consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation(() => {})
        })

        beforeEach(() => {
            consoleWarnSpy.mockClear()
        })

        afterAll(() => {
            consoleWarnSpy.mockRestore()
        })

        it('returns the expected data', () => {
            const dataSetId = 'data-set-foo'
            const categoryComboId = 'category-combo-foo'

            const data = {
                dataSets: {
                    [dataSetId]: {
                        categoryCombo: { id: categoryComboId },
                    },
                },
                categoryCombos: {
                    [categoryComboId]: {
                        id: categoryComboId,
                        categories: [],
                    },
                },
            }

            const actual = getCategoryComboByDataSetId(data, dataSetId)
            const expected = { id: categoryComboId, categories: [] }
            expect(actual).toEqual(expected)
        })

        it('returns undefined when the data set does not have a category combo', () => {
            const dataSetId = 'data-set-foo'
            const categoryComboId = 'category-combo-foo'

            const data = {
                dataSets: {
                    [dataSetId]: {
                        id: dataSetId,
                    },
                },
                categoryCombos: {
                    [categoryComboId]: {
                        id: categoryComboId,
                        categories: [],
                    },
                },
            }

            const actual = getCategoryComboByDataSetId(data, dataSetId)
            const expected = undefined
            expect(actual).toEqual(expected)
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                `Data set with id ${dataSetId} does not have a category combo`
            )
        })

        it("returns undefined when the data set's category combo does not exist", () => {
            const dataSetId = 'data-set-foo'
            const categoryComboId = 'category-combo-foo'

            const data = {
                dataSets: {
                    [dataSetId]: {
                        id: dataSetId,
                        categoryCombo: { id: 'category-combo-bar' },
                    },
                },
                categoryCombos: {
                    [categoryComboId]: {
                        id: categoryComboId,
                        categories: [],
                    },
                },
            }

            const actual = getCategoryComboByDataSetId(data, dataSetId)
            const expected = undefined
            expect(actual).toEqual(expected)
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                `Could not find a category combo for data set with id ${dataSetId}`
            )
        })
    })

    describe('getCategoriesByDataSetId', () => {
        let consoleWarnSpy

        beforeAll(() => {
            consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation(() => {})
        })

        beforeEach(() => {
            consoleWarnSpy.mockClear()
        })

        afterAll(() => {
            consoleWarnSpy.mockRestore()
        })

        it('returns the expected data', () => {
            const dataSetId = 'data-set-foo'
            const categoryComboId = 'category-combo-foo'
            const categoryOneId = 'category-foo'
            const categoryTwoId = 'category-bar'

            const data = {
                dataSets: {
                    [dataSetId]: {
                        categoryCombo: { id: categoryComboId },
                    },
                },
                categoryCombos: {
                    [categoryComboId]: {
                        id: categoryComboId,
                        categories: [categoryOneId, categoryTwoId],
                    },
                },
                categories: {
                    [categoryOneId]: { id: categoryOneId },
                    [categoryTwoId]: { id: categoryTwoId },
                },
            }

            const actual = getCategoriesByDataSetId(data, dataSetId)
            const expected = [{ id: categoryOneId }, { id: categoryTwoId }]
            expect(actual).toEqual(expected)
        })

        it('returns an empty array when the category combo does not exist', () => {
            const dataSetId = 'data-set-foo'
            const categoryComboId = 'category-combo-foo'
            const categoryOneId = 'category-foo'
            const categoryTwoId = 'category-bar'

            const data = {
                dataSets: {
                    [dataSetId]: {
                        categoryCombo: { id: 'category-combo-bar' },
                    },
                },
                categoryCombos: {
                    [categoryComboId]: {
                        id: categoryComboId,
                        categories: [categoryOneId, categoryTwoId],
                    },
                },
                categories: {
                    [categoryOneId]: { id: categoryOneId },
                    [categoryTwoId]: { id: categoryTwoId },
                },
            }

            const actual = getCategoriesByDataSetId(data, dataSetId)
            const expected = []
            expect(actual).toEqual(expected)
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                `Could not find categories for data set with id ${dataSetId}`
            )
        })
    })
})

describe('selectors that group dataElements', () => {
    describe('getGroupedDataElementsByCatComboInOrder', () => {
        it('returns the expected data', () => {
            const categoryComboOne = { id: 'one' }
            const categoryComboTwo = { id: 'two' }
            const dataElements = [
                { categoryCombo: categoryComboOne },
                { categoryCombo: categoryComboTwo },
                { categoryCombo: categoryComboOne },
            ]
            const data = {
                categoryCombos: {
                    one: categoryComboOne,
                    two: categoryComboTwo,
                },
            }
            const expected = [
                {
                    categoryCombo: categoryComboOne,
                    dataElements: [dataElements[0]],
                },
                {
                    categoryCombo: categoryComboTwo,
                    dataElements: [dataElements[1]],
                },
                {
                    categoryCombo: categoryComboOne,
                    dataElements: [dataElements[2]],
                },
            ]

            expect(
                getGroupedDataElementsByCatComboInOrder(data, dataElements)
            ).toEqual(expected)
        })
    })

    describe('getGroupedDataElementsByCatCombo', () => {
        it('returns the expected data', () => {
            const categoryComboOne = { id: 'one' }
            const categoryComboTwo = { id: 'two' }
            const dataElements = [
                { categoryCombo: categoryComboOne },
                { categoryCombo: categoryComboTwo },
                { categoryCombo: categoryComboOne },
            ]
            const data = {
                categoryCombos: {
                    one: categoryComboOne,
                    two: categoryComboTwo,
                },
            }
            const expected = [
                {
                    categoryCombo: categoryComboOne,
                    dataElements: [dataElements[0], dataElements[2]],
                },
                {
                    categoryCombo: categoryComboTwo,
                    dataElements: [dataElements[1]],
                },
            ]

            expect(
                getGroupedDataElementsByCatCombo(data, dataElements)
            ).toEqual(expected)
        })
    })
})

describe('getCoCByCategoryOptions', () => {
    let consoleWarnSpy

    beforeAll(() => {
        consoleWarnSpy = jest
            .spyOn(console, 'warn')
            .mockImplementation(() => {})
    })

    beforeEach(() => {
        consoleWarnSpy.mockClear()
    })

    afterAll(() => {
        consoleWarnSpy.mockRestore()
    })

    it('returns the expected categoryOptionCombo when ids are in the same order', () => {
        const categoryComboId = 'categoryComboId'
        const categoryOptionIds = ['one', 'two']
        const expected = {
            id: 'cocId',
            categoryOptions: ['one', 'two'],
        }

        const data = {
            categoryCombos: {
                [categoryComboId]: {
                    categoryOptionCombos: [
                        {
                            id: 'cocId',
                            categoryOptions: ['one', 'two'],
                        },
                        {
                            id: 'noMatchId',
                            categoryOptions: ['one', 'two', 'three'],
                        },
                    ],
                },
            },
        }

        expect(
            getCoCByCategoryOptions(data, categoryComboId, categoryOptionIds)
        ).toEqual(expected)
    })

    it('returns the expected categoryOptionCombo when ids are in a different order', () => {
        const categoryComboId = 'categoryComboId'
        const categoryOptionIds = ['one', 'two']
        const expected = {
            id: 'cocId',
            categoryOptions: ['two', 'one'],
        }

        const data = {
            categoryCombos: {
                [categoryComboId]: {
                    categoryOptionCombos: [
                        {
                            id: 'cocId',
                            categoryOptions: ['two', 'one'],
                        },
                        {
                            id: 'noMatchId',
                            categoryOptions: ['one', 'two', 'three'],
                        },
                    ],
                },
            },
        }

        expect(
            getCoCByCategoryOptions(data, categoryComboId, categoryOptionIds)
        ).toEqual(expected)
    })

    it('returns null when there is no categoryOptionCombo with a matching set of ids', () => {
        const categoryComboId = 'categoryComboId'
        const categoryOptionIds = ['one', 'two', 'four']

        const data = {
            categoryCombos: {
                [categoryComboId]: {
                    categoryOptionCombos: [
                        {
                            id: 'cocId',
                            categoryOptions: ['two', 'one'],
                        },
                        {
                            id: 'noMatchId',
                            categoryOptions: ['one', 'two', 'three'],
                        },
                    ],
                },
            },
        }

        const actual = getCoCByCategoryOptions(
            data,
            categoryComboId,
            categoryOptionIds
        )
        expect(actual).toBeNull()
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            `Could not find categoryOptionCombo for catCombo ${categoryComboId}, with categoryOptions: ${categoryOptionIds.join()}`
        )
    })
})

describe('getCategoryOptionsByCategoryOptionComboId', () => {
    it('should return an empty array when no coc can be found', () => {
        const metadata = {
            categoryCombos: {
                'cc-id-1': {
                    categoryOptionCombos: [
                        { id: 'coc-id-2' },
                        { id: 'coc-id-3' },
                    ],
                },
                'cc-id-2': {
                    categoryOptionCombos: [
                        { id: 'coc-id-4' },
                        { id: 'coc-id-5' },
                    ],
                },
            },
        }

        const expected = []
        const actual = getCategoryOptionsByCategoryOptionComboId(
            metadata,
            'coc-id-1'
        )

        expect(actual).toEqual(expected)
    })

    it('should return the category options when a coc was found', () => {
        const metadata = {
            categoryCombos: {
                'cc-id-1': {
                    categoryOptionCombos: [
                        {
                            id: 'coc-id-1',
                            categoryOptions: ['co-id-1', 'co-id-2'],
                        },
                        {
                            id: 'coc-id-2',
                            categoryOptions: ['co-id-3', 'co-id-4'],
                        },
                    ],
                },
                'cc-id-2': {
                    categoryOptionCombos: [
                        {
                            id: 'coc-id-3',
                            categoryOptions: ['co-id-5', 'co-id-6'],
                        },
                        {
                            id: 'coc-id-4',
                            categoryOptions: ['co-id-6', 'co-id-8'],
                        },
                    ],
                },
            },
            categoryOptions: {
                'co-id-1': { id: 'co-id-1' },
                'co-id-2': { id: 'co-id-2' },
                'co-id-3': { id: 'co-id-3' },
                'co-id-4': { id: 'co-id-4' },
                'co-id-5': { id: 'co-id-5' },
                'co-id-6': { id: 'co-id-6' },
                'co-id-7': { id: 'co-id-7' },
                'co-id-8': { id: 'co-id-8' },
            },
        }

        const expected = [{ id: 'co-id-1' }, { id: 'co-id-2' }]
        const actual = getCategoryOptionsByCategoryOptionComboId(
            metadata,
            'coc-id-1'
        )

        expect(actual).toEqual(expected)
    })

    describe('getCategoriesWithOptionsWithinPeriod', () => {
        it('should return all category options if none have end dates', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'

            const catcomboid = 'categorycombo-id-1'

            const metadata = {
                dataSets: {
                    [datasetid]: {
                        categoryCombo: { id: catcomboid },
                        periodType: 'Monthly',
                        id: datasetid,
                    },
                },
                categoryCombos: {
                    [catcomboid]: {
                        id: catcomboid,
                        categories: ['co-id-letter', 'co-id-number'],
                    },
                },
                categories: {
                    'co-id-letter': {
                        id: 'co-id-letter',
                        categoryOptions: ['cat-id-a', 'cat-id-b', 'cat-id-c'],
                    },
                    'co-id-number': {
                        id: 'co-id-number',
                        categoryOptions: ['cat-id-1', 'cat-id-2'],
                    },
                },
                categoryOptions: {
                    'cat-id-a': { id: 'cat-id-a' },
                    'cat-id-b': { id: 'cat-id-b' },
                    'cat-id-c': { id: 'cat-id-c' },
                    'cat-id-1': { id: 'cat-id-1' },
                    'cat-id-2': { id: 'cat-id-2' },
                },
            }

            const expected = [
                {
                    categoryOptions: [
                        { id: 'cat-id-a' },
                        { id: 'cat-id-b' },
                        { id: 'cat-id-c' },
                    ],
                    id: 'co-id-letter',
                },
                {
                    categoryOptions: [{ id: 'cat-id-1' }, { id: 'cat-id-2' }],
                    id: 'co-id-number',
                },
            ]

            const actual = getCategoriesWithOptionsWithinPeriod(
                metadata,
                datasetid,
                periodid
            )

            expect(actual).toEqual(expected)
        })

        it('should return category options without endDate or with endDate after period end ', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'

            const catcomboid = 'categorycombo-id-1'

            const metadata = {
                dataSets: {
                    [datasetid]: {
                        categoryCombo: { id: catcomboid },
                        periodType: 'Monthly',
                        id: datasetid,
                    },
                },
                categoryCombos: {
                    [catcomboid]: {
                        id: catcomboid,
                        categories: ['co-id-letter', 'co-id-number'],
                    },
                },
                categories: {
                    'co-id-letter': {
                        id: 'co-id-letter',
                        categoryOptions: ['cat-id-a', 'cat-id-b', 'cat-id-c'],
                    },
                    'co-id-number': {
                        id: 'co-id-number',
                        categoryOptions: ['cat-id-1', 'cat-id-2'],
                    },
                },
                categoryOptions: {
                    'cat-id-a': { id: 'cat-id-a', endDate: '2020-01-01' },
                    'cat-id-b': { id: 'cat-id-b', endDate: '2022-01-01' },
                    'cat-id-c': { id: 'cat-id-c' },
                    'cat-id-1': { id: 'cat-id-1', endDate: '2022-09-01' },
                    'cat-id-2': { id: 'cat-id-2' },
                },
            }

            const expected = [
                { categoryOptions: [{ id: 'cat-id-c' }], id: 'co-id-letter' },
                {
                    categoryOptions: [
                        { id: 'cat-id-1', endDate: '2022-09-01' },
                        { id: 'cat-id-2' },
                    ],
                    id: 'co-id-number',
                },
            ]

            const actual = getCategoriesWithOptionsWithinPeriod(
                metadata,
                datasetid,
                periodid
            )

            expect(actual).toEqual(expected)
        })

        it('should return category options without endDate or with endDate after period end, adjusting for openPeriodsAfterCoEndDate', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'

            const catcomboid = 'categorycombo-id-1'

            const metadata = {
                dataSets: {
                    [datasetid]: {
                        categoryCombo: { id: catcomboid },
                        periodType: 'Monthly',
                        id: datasetid,
                        openPeriodsAfterCoEndDate: 2,
                    },
                },
                categoryCombos: {
                    [catcomboid]: {
                        id: catcomboid,
                        categories: ['co-id-letter', 'co-id-number'],
                    },
                },
                categories: {
                    'co-id-letter': {
                        id: 'co-id-letter',
                        categoryOptions: ['cat-id-a', 'cat-id-b', 'cat-id-c'],
                    },
                    'co-id-number': {
                        id: 'co-id-number',
                        categoryOptions: ['cat-id-1', 'cat-id-2'],
                    },
                },
                categoryOptions: {
                    'cat-id-a': { id: 'cat-id-a', endDate: '2020-01-01' },
                    'cat-id-b': { id: 'cat-id-b', endDate: '2022-01-01' },
                    'cat-id-c': { id: 'cat-id-c' },
                    'cat-id-1': { id: 'cat-id-1', endDate: '2022-09-01' },
                    'cat-id-2': { id: 'cat-id-2' },
                },
            }

            const expected = [
                {
                    categoryOptions: [
                        { id: 'cat-id-b', endDate: '2022-01-01' },
                        { id: 'cat-id-c' },
                    ],
                    id: 'co-id-letter',
                },
                {
                    categoryOptions: [
                        { id: 'cat-id-1', endDate: '2022-09-01' },
                        { id: 'cat-id-2' },
                    ],
                    id: 'co-id-number',
                },
            ]

            const actual = getCategoriesWithOptionsWithinPeriod(
                metadata,
                datasetid,
                periodid
            )

            expect(actual).toEqual(expected)
        })
    })
})
