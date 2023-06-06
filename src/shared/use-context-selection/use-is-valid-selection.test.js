import { useMetadata } from '../metadata/index.js'
import { useContextSelection } from './use-context-selection.js'
import { useIsValidSelection } from './use-is-valid-selection.js'

jest.mock('./use-context-selection.js', () => ({
    useContextSelection: jest.fn(),
}))

jest.mock('../metadata/use-metadata.js', () => ({
    useMetadata: jest.fn(),
}))

describe('useIsValidSelection', () => {
    it('should return true for a non-default category combo', () => {
        const contextSelection = {
            dataSetId: 'dataSet1',
            orgUnitId: 'orgUnit1',
            periodId: '2023',
            attributeOptionComboSelection: {
                category1: 'categoryOption1',
                category2: 'categoryOption2',
            },
        }
        useContextSelection.mockImplementation(() => [contextSelection])

        const metadata = {
            dataSets: {
                dataSet1: {
                    categoryCombo: { id: 'categoryCombo1' },
                },
            },
            categoryCombos: {
                categoryCombo1: {
                    isDefault: false,
                    categories: ['category1', 'category2'],
                },
            },
        }
        useMetadata.mockImplementation(() => ({ data: metadata }))

        expect(useIsValidSelection()).toBe(true)
    })

    it('should return true when the category combo is the default one', () => {
        const contextSelection = {
            dataSetId: 'dataSet1',
            orgUnitId: 'orgUnit1',
            periodId: '2023',
            attributeOptionComboSelection: {},
        }
        useContextSelection.mockImplementation(() => [contextSelection])

        const metadata = {
            dataSets: {
                dataSet1: {
                    categoryCombo: { id: 'categoryCombo1' },
                },
            },
            categoryCombos: {
                categoryCombo1: {
                    isDefault: true,
                    categories: ['category1'],
                },
            },
        }
        useMetadata.mockImplementation(() => ({ data: metadata }))

        expect(useIsValidSelection()).toBe(true)
    })

    it('should return false when the categoryCombo is undefined', () => {
        const contextSelection = {
            dataSetId: 'dataSet1',
            orgUnitId: 'orgUnit1',
            periodId: '2023',
            attributeOptionComboSelection: {},
        }
        useContextSelection.mockImplementation(() => [contextSelection])

        const metadata = {
            dataSets: {
                dataSet1: {
                    categoryCombo: { id: 'categoryCombo2' },
                },
            },
            categoryCombos: {},
        }
        useMetadata.mockImplementation(() => ({ data: metadata }))

        expect(useIsValidSelection()).toBe(false)
    })

    it('should return false when the data set is undefined', () => {
        const contextSelection = {
            dataSetId: 'dataSet1',
            orgUnitId: 'orgUnit1',
            periodId: '2023',
            attributeOptionComboSelection: {},
        }
        useContextSelection.mockImplementation(() => [contextSelection])

        const metadata = {
            dataSets: {},
            categoryCombos: {},
        }
        useMetadata.mockImplementation(() => ({ data: metadata }))

        expect(useIsValidSelection()).toBe(false)
    })

    it('should return false when there is no metadata', () => {
        const contextSelection = {
            dataSetId: 'dataSet1',
            orgUnitId: 'orgUnit1',
            periodId: '2023',
            attributeOptionComboSelection: {},
        }
        useContextSelection.mockImplementation(() => [contextSelection])

        const metadata = null
        useMetadata.mockImplementation(() => ({ data: metadata }))

        expect(useIsValidSelection()).toBe(false)
    })

    it('should return false when there is no selected data set', () => {
        const contextSelection = {
            orgUnitId: 'orgUnit1',
            periodId: '2023',
            attributeOptionComboSelection: {},
        }
        useContextSelection.mockImplementation(() => [contextSelection])

        const metadata = {
            dataSets: {
                dataSet1: {
                    categoryCombo: { id: 'categoryCombo1' },
                },
            },
            categoryCombos: {
                categoryCombo1: {
                    isDefault: false,
                    categories: ['category1', 'category2'],
                },
            },
        }
        useMetadata.mockImplementation(() => ({ data: metadata }))

        expect(useIsValidSelection()).toBe(false)
    })

    it('should return false when there is no selected org unit', () => {
        const contextSelection = {
            dataSetId: 'dataSet1',
            periodId: '2023',
            attributeOptionComboSelection: {},
        }
        useContextSelection.mockImplementation(() => [contextSelection])

        const metadata = {
            dataSets: {
                dataSet1: {
                    categoryCombo: { id: 'categoryCombo1' },
                },
            },
            categoryCombos: {
                categoryCombo1: {
                    isDefault: false,
                    categories: ['category1', 'category2'],
                },
            },
        }
        useMetadata.mockImplementation(() => ({ data: metadata }))

        expect(useIsValidSelection()).toBe(false)
    })

    it('should return false when there is no selected period', () => {
        const contextSelection = {
            dataSetId: 'dataSet1',
            orgUnitId: 'orgUnit1',
            attributeOptionComboSelection: {},
        }
        useContextSelection.mockImplementation(() => [contextSelection])

        const metadata = {
            dataSets: {
                dataSet1: {
                    categoryCombo: { id: 'categoryCombo1' },
                },
            },
            categoryCombos: {
                categoryCombo1: {
                    isDefault: false,
                    categories: ['category1', 'category2'],
                },
            },
        }
        useMetadata.mockImplementation(() => ({ data: metadata }))

        expect(useIsValidSelection()).toBe(false)
    })
})
