import {
    getSectionByDataSetIdAndSectionId,
    getNrOfColumnsInCategoryCombo,
    getIndicatorsByDataSetIdAndSectionId,
    getCategoryOptionCombo,
    getApplicableDataInputPeriod,
    getSectionsByDataSetId,
    getIndicatorsByDataSetId,
    getComputedCategoryOptionIdsByCatComboId,
    getOptionSetById,
    getCategories,
    getCategoriesByCategoryComboId,
    getCategoriesByDataSetId,
    getCategoriesWithOptionsWithinPeriodWithOrgUnit,
    getCategoryById,
    getCategoryComboByDataSetId,
    getCategoryComboById,
    getCategoryCombos,
    getCategoryOptionById,
    getCategoryOptionCombosByCategoryComboId,
    getCategoryOptions,
    getCategoryOptionsByCategoryId,
    getCategoryOptionsByCategoryOptionComboId,
    getCoCByCategoryOptions,
    getDataElementById,
    getDataElements,
    getDataElementsByDataSetId,
    getDataElementsByDataSetIdSorted,
    getDataElementsBySection,
    getDataSetById,
    getDataSets,
    getGroupedDataElementsByCatCombo,
    getGroupedDataElementsByCatComboInOrder,
    getIndicators,
    getOptionSets,
    getSections,
} from './selectors.js'

/*
 *
 * simple selectors
 * ================
 *
 */
test('getOptionSets', () => {
    const expected = 'expected'
    const data = { optionSets: expected }
    expect(getOptionSets(data)).toBe(expected)
})

test('getIndicators', () => {
    const expected = 'expected'
    const data = { indicators: expected }
    expect(getIndicators(data)).toBe(expected)
})

test('getCategories', () => {
    const expected = 'expected'
    const data = { categories: expected }
    expect(getCategories(data)).toBe(expected)
})

test('getCategoryCombos', () => {
    const expected = 'expected'
    const data = { categoryCombos: expected }
    expect(getCategoryCombos(data)).toBe(expected)
})

test('getCategoryOptions', () => {
    const expected = 'expected'
    const data = { categoryOptions: expected }
    expect(getCategoryOptions(data)).toBe(expected)
})

test('getDataElements', () => {
    const expected = 'expected'
    const data = { dataElements: expected }
    expect(getDataElements(data)).toBe(expected)
})

test('getDataSets', () => {
    const expected = 'expected'
    const data = { dataSets: expected }
    expect(getDataSets(data)).toBe(expected)
})

test('getSections', () => {
    const expected = 'expected'
    const data = { sections: expected }
    expect(getSections(data)).toBe(expected)
})

/*
 *
 * simple selectors that select by id
 * ==================================
 *
 */
describe('getOptionSetById', () => {
    it('should return the expected data', () => {
        const id = 'id'
        const expected = 'expected'
        const data = {
            optionSets: {
                [id]: expected,
            },
        }

        expect(getOptionSetById(data, id)).toBe(expected)
    })

    it('should return undefined if no item could be found', () => {
        const id = 'id'
        const data = { optionSets: [] }

        expect(getOptionSetById(data, id)).toBe(undefined)
    })
})

describe('getDataElementById', () => {
    it('should return the expected data', () => {
        const id = 'id'
        const expected = 'expected'
        const data = {
            dataElements: {
                [id]: expected,
            },
        }

        expect(getDataElementById(data, id)).toBe(expected)
    })

    it('should return undefined if no item could be found', () => {
        const id = 'id'
        const data = { dataElements: [] }

        expect(getDataElementById(data, id)).toBe(undefined)
    })
})

describe('getCategoryOptionById', () => {
    it('should return the expected data', () => {
        const id = 'id'
        const expected = 'expected'
        const data = {
            categoryOptions: {
                [id]: expected,
            },
        }

        expect(getCategoryOptionById(data, id)).toBe(expected)
    })

    it('should return undefined if no item could be found', () => {
        const id = 'id'
        const data = { categoryOptions: [] }

        expect(getCategoryOptionById(data, id)).toBe(undefined)
    })
})

describe('getCategoryById', () => {
    it('should return the expected data', () => {
        const id = 'id'
        const expected = 'expected'
        const data = {
            categories: {
                [id]: expected,
            },
        }

        expect(getCategoryById(data, id)).toBe(expected)
    })

    it('should return undefined if no item could be found', () => {
        const id = 'id'
        const data = { categories: [] }

        expect(getCategoryById(data, id)).toBe(undefined)
    })
})

describe('getCategoryById', () => {
    it('should return the expected data', () => {
        const id = 'id'
        const expected = 'expected'
        const data = {
            categories: {
                [id]: expected,
            },
        }

        expect(getCategoryById(data, id)).toBe(expected)
    })

    it('should return undefined if no item could be found', () => {
        const id = 'id'
        const data = { categories: [] }

        expect(getCategoryById(data, id)).toBe(undefined)
    })
})

describe('getCategoryById', () => {
    it('should return the expected data', () => {
        const id = 'id'
        const expected = 'expected'
        const data = {
            categories: {
                [id]: expected,
            },
        }

        expect(getCategoryById(data, id)).toBe(expected)
    })

    it('should return undefined if no item could be found', () => {
        const id = 'id'
        const data = { categories: [] }

        expect(getCategoryById(data, id)).toBe(undefined)
    })
})

describe('getDataSetById', () => {
    it('should return the expected data', () => {
        const id = 'id'
        const expected = 'expected'
        const data = {
            dataSets: {
                [id]: expected,
            },
        }

        expect(getDataSetById(data, id)).toBe(expected)
    })

    it('should return undefined if no item could be found', () => {
        const id = 'id'
        const data = { dataSets: [] }

        expect(getDataSetById(data, id)).toBe(undefined)
    })
})

describe('getCategoryComboById', () => {
    it('should return the expected data', () => {
        const id = 'id'
        const expected = 'expected'
        const data = {
            categoryCombos: {
                [id]: expected,
            },
        }

        expect(getCategoryComboById(data, id)).toBe(expected)
    })

    it('should return undefined if no item could be found', () => {
        const id = 'id'
        const data = { categoryCombos: [] }

        expect(getCategoryComboById(data, id)).toBe(undefined)
    })
})

/*
 *
 * complex selectors that select by id
 * ==================================
 *
 */

describe('getComputedCategoryOptionIdsByCatComboId', () => {
    it('should return the cartesian product of all category options within the categories for a particular category option combo', () => {
        const data = {
            categoryCombos: {
                catCombo1: {
                    categories: ['category1', 'category2'],
                },
            },
            categories: {
                category1: {
                    categoryOptions: ['categoryOption1', 'categoryOption2'],
                },
                category2: {
                    categoryOptions: ['categoryOption3', 'categoryOption4'],
                },
            },
        }
        const expected = [
            ['categoryOption1', 'categoryOption3'],
            ['categoryOption1', 'categoryOption4'],
            ['categoryOption2', 'categoryOption3'],
            ['categoryOption2', 'categoryOption4'],
        ]
        const actual = getComputedCategoryOptionIdsByCatComboId(
            data,
            'catCombo1'
        )

        expect(actual).toEqual(expected)
    })

    it("should return an empty array when the provided category combo doesn't exist", () => {
        const data = { categoryCombos: {} }
        const expected = []
        const actual = getComputedCategoryOptionIdsByCatComboId(
            data,
            'catCombo1'
        )
        expect(actual).toEqual(expected)
    })
})

describe('getIndicatorsByDataSetId', () => {
    it('should return all the indicators for a particular data set', () => {
        const data = {
            dataSets: {
                dataSet1: {
                    indicators: ['indicator1', 'indicator2'],
                },
            },
            indicators: {
                indicator1: { id: 'indicator1' },
                indicator2: { id: 'indicator2' },
            },
        }

        const expected = [{ id: 'indicator1' }, { id: 'indicator2' }]

        const actual = getIndicatorsByDataSetId(data, 'dataSet1')

        expect(actual).toEqual(expected)
    })

    it('should return an empty array when the data set does not exist', () => {
        const data = { dataSets: {} }
        expect(getIndicatorsByDataSetId(data, 'dataSet1')).toEqual([])
    })
})

describe('getSectionsByDataSetId', () => {
    it('should return all sections of a data set', () => {
        const data = {
            dataSets: {
                dataSet1: {
                    sections: [{ id: 'section1' }, { id: 'section2' }],
                },
            },
        }

        const expected = [{ id: 'section1' }, { id: 'section2' }]
        const actual = getSectionsByDataSetId(data, 'dataSet1')
        expect(actual).toEqual(expected)
    })

    it('should return an empty array when the data set does not exist', () => {
        expect(getSectionsByDataSetId({ dataSets: {} }, 'dataSet1')).toEqual([])
    })
})

describe('getSortedCoCsByCatComboId', () => {
    it('returns the expected data', () => {
        const data = {
            categoryCombos: {
                catCombo1: {
                    categories: ['category1', 'category2'],
                },
            },
            categories: {
                category1: {
                    categoryOptions: ['categoryOption1', 'categoryOption2'],
                },
                category2: {
                    categoryOptions: ['categoryOption3', 'categoryOption4'],
                },
            },
        }
        const expected = [
            ['categoryOption1', 'categoryOption3'],
            ['categoryOption1', 'categoryOption4'],
            ['categoryOption2', 'categoryOption3'],
            ['categoryOption2', 'categoryOption4'],
        ]
        const actual = getComputedCategoryOptionIdsByCatComboId(
            data,
            'catCombo1'
        )

        expect(actual).toEqual(expected)
    })

    it('should return an empty array when the category combo does not exist', () => {
        expect(
            getComputedCategoryOptionIdsByCatComboId(
                { categoryCombos: {} },
                'catCombo1'
            )
        ).toEqual([])
    })
})

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

        expect(getCategoriesByCategoryComboId(data, categoryComboId)).toEqual(
            expected
        )
    })

    it('should return undefined when the category combo does not exist', () => {
        const data = { categoryCombos: {} }
        expect(getCategoriesByCategoryComboId(data, 'foo')).toBe(undefined)
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

        expect(getDataElementsByDataSetId(data, dataSetId)).toEqual(expected)
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

        expect(getDataElementsByDataSetId(data, dataSetId)).toEqual(expected)
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

        expect(getDataElementsBySection(data, dataSetId, sectionId)).toEqual(
            expected
        )
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

/*
 *
 * selectors that group dataElements
 * =================================
 *
 */

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

        expect(getGroupedDataElementsByCatCombo(data, dataElements)).toEqual(
            expected
        )
    })
})

/**
 * Remaining selectors
 * ===================
 */

describe('getSectionByDataSetIdAndSectionId', () => {
    it('should return the section for a data set id and section id', () => {
        const data = {
            dataSets: {
                dataSet1: {
                    sections: [{ id: 'section1' }, { id: 'section2' }],
                },
            },
        }

        const expected = { id: 'section1' }
        const actual = getSectionByDataSetIdAndSectionId(
            data,
            'dataSet1',
            'section1'
        )

        expect(actual).toEqual(expected)
    })

    it('should return undefined when the data set does not exist', () => {
        const data = { dataSets: {} }
        const expected = undefined
        const actual = getSectionByDataSetIdAndSectionId(
            data,
            'dataSet1',
            'section1'
        )

        expect(actual).toEqual(expected)
    })

    it('should return undefined when the section does not exist', () => {
        const data = {
            dataSets: {
                dataSet1: {
                    sections: [{ id: 'section1' }],
                },
            },
        }
        const expected = undefined
        const actual = getSectionByDataSetIdAndSectionId(
            data,
            'dataSet1',
            'section2'
        )

        expect(actual).toEqual(expected)
    })
})

describe('getNrOfColumnsInCategoryCombo', () => {
    it('should return the numbers of columns for a category combo', () => {
        const data = {
            categoryCombos: {
                categoryCombo1: {
                    categories: ['category1', 'category2', 'category3'],
                },
            },
            categories: {
                category1: {
                    categoryOptions: ['categoryOption1', 'categoryOption2'],
                },
                category2: {
                    categoryOptions: ['categoryOption3', 'categoryOption4'],
                },
                category3: {
                    categoryOptions: ['categoryOption5', 'categoryOption6'],
                },
            },
        }

        expect(getNrOfColumnsInCategoryCombo(data, 'categoryCombo1')).toBe(8)
    })

    it('should return 1 when the category combo does not exist', () => {
        const data = { categoryCombos: {} }
        expect(getNrOfColumnsInCategoryCombo(data, 'categoryCombo1')).toBe(1)
    })
})

describe('getIndicatorsByDataSetIdAndSectionId', () => {
    it("should return the indicators of a data set's section", () => {
        const data = {
            dataSets: {
                dataSet1: {
                    sections: [
                        {
                            id: 'section1',
                            indicators: ['indicator1', 'indicator2'],
                        },
                        {
                            id: 'section2',
                            indicators: ['indicator3', 'indicator4'],
                        },
                    ],
                },
            },
            indicators: {
                indicator1: { id: 'indicator1' },
                indicator2: { id: 'indicator2' },
                indicator3: { id: 'indicator3' },
                indicator4: { id: 'indicator4' },
            },
        }

        const expected = [{ id: 'indicator1' }, { id: 'indicator2' }]

        const actual = getIndicatorsByDataSetIdAndSectionId(
            data,
            'dataSet1',
            'section1'
        )

        expect(actual).toEqual(expected)
    })

    it('should return an empty array when the data set does not exist', () => {
        expect(
            getIndicatorsByDataSetIdAndSectionId({ dataSets: {} }, 'foo', 'bar')
        ).toEqual([])
    })
})

describe('getCategoryOptionCombo', () => {
    it('should return the category option combo for the provided category combo id and category option combo id', () => {
        const data = {
            categoryCombos: {
                categoryCombo1: {
                    categoryOptionCombos: [
                        { id: 'categoryOptionCombo1' },
                        { id: 'categoryOptionCombo2' },
                    ],
                },
            },
        }

        const expected = { id: 'categoryOptionCombo1' }
        const actual = getCategoryOptionCombo(
            data,
            'categoryCombo1',
            'categoryOptionCombo1'
        )

        expect(actual).toEqual(expected)
    })

    it('should return undefined when the category combo does not exist', () => {
        expect(
            getCategoryOptionCombo(
                { categoryCombos: {} },
                'categoryCombo1',
                'categoryOptionCombo1'
            )
        ).toEqual(undefined)
    })

    it('should return undefined when there is no category option combo for the provided id', () => {
        const data = {
            categoryCombos: {
                categoryCombo1: {
                    categoryOptionCombos: [
                        { id: 'categoryOptionCombo1' },
                        { id: 'categoryOptionCombo2' },
                    ],
                },
            },
        }

        const expected = undefined
        const actual = getCategoryOptionCombo(
            data,
            'categoryCombo1',
            'categoryOptionCombo3'
        )

        expect(actual).toEqual(expected)
    })
})

describe('getApplicableDataInputPeriod', () => {
    it('should return the period for a given data set id and period id', () => {
        const data = {
            dataSets: {
                dataSet1: {
                    id: 'dataSet1',
                    dataInputPeriods: [
                        {
                            period: { id: '202304', name: '202304' },
                        },
                        {
                            period: { id: '202301', name: '202301' },
                            openingDate: '2023-01-01T00:00:00.000',
                            closingDate: '2023-05-17T00:00:00.000',
                        },
                    ],
                },
            },
        }

        const expected = {
            period: { id: '202301', name: '202301' },
            openingDate: '2023-01-01T00:00:00.000',
            closingDate: '2023-05-17T00:00:00.000',
        }

        const periodId = '202301'
        const dataSetId = 'dataSet1'
        const actual = getApplicableDataInputPeriod(data, dataSetId, periodId)

        expect(actual).toEqual(expected)
    })

    it('should return null when the data set does not exist', () => {
        expect(
            getApplicableDataInputPeriod({ dataSets: {} }, 'dataSetId', '2023')
        ).toBe(null)
    })

    it('should return null when no period id has been provided', () => {
        const data = {
            dataSets: {
                dataSet1: {
                    id: 'dataSet1',
                    dataInputPeriods: [
                        {
                            period: { id: '202304', name: '202304' },
                        },
                        {
                            period: { id: '202301', name: '202301' },
                            openingDate: '2023-01-01T00:00:00.000',
                            closingDate: '2023-05-17T00:00:00.000',
                        },
                    ],
                },
            },
        }

        expect(getApplicableDataInputPeriod(data, 'dataSetId')).toBe(null)
    })

    it("should return null when the dataset's dataInputPeriods does not contain the a period with the provided id", () => {
        const data = {
            dataSets: {
                dataSet1: {
                    id: 'dataSet1',
                    dataInputPeriods: [
                        {
                            period: { id: '202304', name: '202304' },
                        },
                        {
                            period: { id: '202301', name: '202301' },
                            openingDate: '2023-01-01T00:00:00.000',
                            closingDate: '2023-05-17T00:00:00.000',
                        },
                    ],
                },
            },
        }

        expect(getApplicableDataInputPeriod(data, 'dataSet1', '202303')).toBe(
            null
        )
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

    it('returns the expected categoryOptionCombo with updated ids when ids are in a different order', () => {
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

    describe('getCategoriesWithOptionsWithinPeriodWithOrgUnit', () => {
        it('should return all category options if none have end dates', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'
            const orgunitid = 'orgunit-id-z'
            const orgunitpath = '/orgunit-id-x/orgunit-id-y/orgunit-id-z'

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

            const calendar = 'gregory'

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

            const actual = getCategoriesWithOptionsWithinPeriodWithOrgUnit(
                metadata,
                datasetid,
                periodid,
                orgunitid,
                orgunitpath,
                calendar
            )

            expect(actual).toEqual(expected)
        })

        it('should return category options without endDate or with endDate after period end ', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'
            const orgunitid = 'orgunit-id-z'
            const orgunitpath = '/orgunit-id-x/orgunit-id-y/orgunit-id-z'

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

            const calendar = 'gregory'

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

            const actual = getCategoriesWithOptionsWithinPeriodWithOrgUnit(
                metadata,
                datasetid,
                periodid,
                orgunitid,
                orgunitpath,
                calendar
            )

            expect(actual).toEqual(expected)
        })

        it('should return category options without endDate or with endDate after period end, adjusting for openPeriodsAfterCoEndDate', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'
            const orgunitid = 'orgunit-id-z'
            const orgunitpath = '/orgunit-id-x/orgunit-id-y/orgunit-id-z'

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

            const calendar = 'gregory'

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

            const actual = getCategoriesWithOptionsWithinPeriodWithOrgUnit(
                metadata,
                datasetid,
                periodid,
                orgunitid,
                orgunitpath,
                calendar
            )

            expect(actual).toEqual(expected)
        })

        it('should return all category options if none have assigned orgunits', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'
            const orgunitid = 'orgunit-id-z'
            const orgunitpath = '/orgunit-id-x/orgunit-id-y/orgunit-id-z'

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
                    'cat-id-a': { id: 'cat-id-a', organisationUnits: [] },
                    'cat-id-b': { id: 'cat-id-b', organisationUnits: [] },
                    'cat-id-c': { id: 'cat-id-c', organisationUnits: [] },
                    'cat-id-1': { id: 'cat-id-1', organisationUnits: [] },
                    'cat-id-2': { id: 'cat-id-2' },
                },
            }

            const calendar = 'gregory'

            const expected = [
                {
                    categoryOptions: [
                        { id: 'cat-id-a', organisationUnits: [] },
                        { id: 'cat-id-b', organisationUnits: [] },
                        { id: 'cat-id-c', organisationUnits: [] },
                    ],
                    id: 'co-id-letter',
                },
                {
                    categoryOptions: [
                        { id: 'cat-id-1', organisationUnits: [] },
                        { id: 'cat-id-2' },
                    ],
                    id: 'co-id-number',
                },
            ]

            const actual = getCategoriesWithOptionsWithinPeriodWithOrgUnit(
                metadata,
                datasetid,
                periodid,
                orgunitid,
                orgunitpath,
                calendar
            )

            expect(actual).toEqual(expected)
        })

        it('should return relevant category options if some have restricted org units', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'
            const orgunitid = 'orgunit-id-z'
            const orgunitpath = '/orgunit-id-x/orgunit-id-y/orgunit-id-z'

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
                    'cat-id-a': {
                        id: 'cat-id-a',
                        organisationUnits: ['fake-orgunit1'],
                    },
                    'cat-id-b': {
                        id: 'cat-id-b',
                        organisationUnits: ['fake-orgunit1'],
                    },
                    'cat-id-c': {
                        id: 'cat-id-c',
                        organisationUnits: ['fake-orgunit2'],
                    },
                    'cat-id-1': {
                        id: 'cat-id-1',
                        organisationUnits: ['orgunit-id-z'],
                    },
                    'cat-id-2': { id: 'cat-id-2', organisationUnits: [] },
                },
            }

            const calendar = 'gregory'

            const expected = [
                {
                    categoryOptions: [],
                    id: 'co-id-letter',
                },
                {
                    categoryOptions: [
                        { id: 'cat-id-1', organisationUnits: ['orgunit-id-z'] },
                        { id: 'cat-id-2', organisationUnits: [] },
                    ],
                    id: 'co-id-number',
                },
            ]

            const actual = getCategoriesWithOptionsWithinPeriodWithOrgUnit(
                metadata,
                datasetid,
                periodid,
                orgunitid,
                orgunitpath,
                calendar
            )

            expect(actual).toEqual(expected)
        })

        it('should restrict based on orgunitid alone if orgunitpath is undefined ', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'
            const orgunitid = 'orgunit-id-z'
            const orgunitpath = undefined

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
                        categoryOptions: ['cat-id-1', 'cat-id-2', 'cat-id-3'],
                    },
                },
                categoryOptions: {
                    'cat-id-a': {
                        id: 'cat-id-a',
                        organisationUnits: ['fake-orgunit1', 'orgunit-id-y'],
                    },
                    'cat-id-b': {
                        id: 'cat-id-b',
                        organisationUnits: ['fake-orgunit1'],
                    },
                    'cat-id-c': {
                        id: 'cat-id-c',
                        organisationUnits: ['fake-orgunit2'],
                    },
                    'cat-id-1': {
                        id: 'cat-id-1',
                        organisationUnits: ['orgunit-id-z'],
                    },
                    'cat-id-2': { id: 'cat-id-2', organisationUnits: [] },
                    'cat-id-3': {
                        id: 'cat-id-3',
                        organisationUnits: ['orgunit-id-x'],
                    },
                },
            }

            const calendar = 'gregory'

            const expected = [
                {
                    categoryOptions: [],
                    id: 'co-id-letter',
                },
                {
                    categoryOptions: [
                        { id: 'cat-id-1', organisationUnits: ['orgunit-id-z'] },
                        { id: 'cat-id-2', organisationUnits: [] },
                    ],
                    id: 'co-id-number',
                },
            ]

            const actual = getCategoriesWithOptionsWithinPeriodWithOrgUnit(
                metadata,
                datasetid,
                periodid,
                orgunitid,
                orgunitpath,
                calendar
            )

            expect(actual).toEqual(expected)
        })

        it('should check if category option is assigned to ancestor org unit when filtering based on org units', () => {
            const datasetid = 'dataset-id-1a'
            const periodid = '202201'
            const orgunitid = 'orgunit-id-z'
            const orgunitpath = '/orgunit-id-x/orgunit-id-y/orgunit-id-z'

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
                        categoryOptions: ['cat-id-1', 'cat-id-2', 'cat-id-3'],
                    },
                },
                categoryOptions: {
                    'cat-id-a': {
                        id: 'cat-id-a',
                        organisationUnits: ['fake-orgunit1', 'orgunit-id-y'],
                    },
                    'cat-id-b': {
                        id: 'cat-id-b',
                        organisationUnits: ['fake-orgunit1'],
                    },
                    'cat-id-c': {
                        id: 'cat-id-c',
                        organisationUnits: ['fake-orgunit2'],
                    },
                    'cat-id-1': {
                        id: 'cat-id-1',
                        organisationUnits: ['orgunit-id-z'],
                    },
                    'cat-id-2': { id: 'cat-id-2', organisationUnits: [] },
                    'cat-id-3': {
                        id: 'cat-id-3',
                        organisationUnits: ['orgunit-id-x'],
                    },
                },
            }

            const calendar = 'gregory'

            const expected = [
                {
                    categoryOptions: [
                        {
                            id: 'cat-id-a',
                            organisationUnits: [
                                'fake-orgunit1',
                                'orgunit-id-y',
                            ],
                        },
                    ],
                    id: 'co-id-letter',
                },
                {
                    categoryOptions: [
                        { id: 'cat-id-1', organisationUnits: ['orgunit-id-z'] },
                        { id: 'cat-id-2', organisationUnits: [] },
                        { id: 'cat-id-3', organisationUnits: ['orgunit-id-x'] },
                    ],
                    id: 'co-id-number',
                },
            ]

            const actual = getCategoriesWithOptionsWithinPeriodWithOrgUnit(
                metadata,
                datasetid,
                periodid,
                orgunitid,
                orgunitpath,
                calendar
            )

            expect(actual).toEqual(expected)
        })
    })
})
