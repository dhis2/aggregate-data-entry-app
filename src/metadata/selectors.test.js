import {
    getCategories,
    getCategoriesByCategoryComboId,
    getCategoryById,
    getCategoryComboById,
    getCategoryCombos,
    getCategoryOptionCombos,
    getCategoryOptionCombosByCategoryComboId,
    getCategoryOptions,
    getCategoryOptionsByCategoryId,
    getCoCByCategoryOptions,
    getDataElements,
    getDataElementsByDataSetId,
    getDataElementsBySection,
    getDataSetById,
    getDataSets,
    getSections,
    getGroupedDataElementsByCatCombo,
    getGroupedDataElementsByCatComboInOrder,
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

    describe('getCategoryOptionCombos', () => {
        it('returns the expected data', () => {
            const expected = 'expected'
            const data = { categoryOptionCombos: expected }

            expect(getCategoryOptionCombos(data)).toBe(expected)
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
                        categoryOptionCombos: [categoryOptionCombo.id],
                    },
                },
                categoryOptionCombos: {
                    [categoryOptionCombo.id]: categoryOptionCombo,
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
            ).toBeUndefined()
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
                    },
                },
                sections: {
                    [sectionId]: section,
                },
            }

            expect(
                getDataElementsBySection(data, dataSetId, sectionId)
            ).toEqual(expected)
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
    it('returns the expected categoryOptionCombo when ids are in the same order', () => {
        const categoryComboId = 'categoryComboId'
        const categoryOptionIds = ['one', 'two']
        const expected = { categoryOptions: categoryOptionIds }

        const data = {
            categoryCombos: {
                [categoryComboId]: {
                    categoryOptionCombos: ['id'],
                },
            },
            categoryOptionCombos: {
                id: expected,
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
            categoryOptions: [categoryOptionIds[1], categoryOptionIds[0]],
        }

        const data = {
            categoryCombos: {
                [categoryComboId]: {
                    categoryOptionCombos: ['id'],
                },
            },
            categoryOptionCombos: {
                id: expected,
            },
        }

        expect(
            getCoCByCategoryOptions(data, categoryComboId, categoryOptionIds)
        ).toEqual(expected)
    })

    it('returns null when there is no categoryOptionCombo with a matching set of ids', () => {
        const categoryComboId = 'categoryComboId'
        const categoryOptionIds = ['one', 'two']

        const data = {
            categoryCombos: {
                [categoryComboId]: {
                    categoryOptionCombos: ['id'],
                },
            },
            categoryOptionCombos: {
                id: {
                    categoryOptions: [],
                },
            },
        }

        expect(
            getCoCByCategoryOptions(data, categoryComboId, categoryOptionIds)
        ).toBeNull()
    })
})
