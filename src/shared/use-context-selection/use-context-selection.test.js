import { useQueryParam } from 'use-query-params'
import {
    PARAMS_SCHEMA,
    useAttributeOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
    useSectionFilter,
} from './use-context-selection.js'

jest.mock('use-query-params', () => ({
    ArrayParam: 'ArrayParam',
    StringParam: 'StringParam',
    useQueryParam: jest.fn(),
    useQueryParams: jest.fn(),
    withDefault: jest.fn(),
}))

describe('use-query-params usage', () => {
    afterEach(() => {
        useQueryParam.mockClear()
    })

    describe('useDataSetId', () => {
        it('should pass the same key to "useQueryParam" as is defined in the PARAMS_SCHEMA', () => {
            useDataSetId()

            const key = 'dataSetId'
            expect(useQueryParam.mock.calls[0]).toEqual(
                expect.arrayContaining([key])
            )
            expect(PARAMS_SCHEMA).toHaveProperty(key)
        })
    })

    describe('useOrgUnitId', () => {
        it('should pass the same key to "useQueryParam" as is defined in the PARAMS_SCHEMA', () => {
            useOrgUnitId()

            const key = 'orgUnitId'
            expect(useQueryParam.mock.calls[0]).toEqual(
                expect.arrayContaining([key])
            )
            expect(PARAMS_SCHEMA).toHaveProperty(key)
        })
    })

    describe('usePeriodId', () => {
        it('should pass the same key to "useQueryParam" as is defined in the PARAMS_SCHEMA', () => {
            usePeriodId()

            const key = 'periodId'
            expect(useQueryParam.mock.calls[0]).toEqual(
                expect.arrayContaining([key])
            )
            expect(PARAMS_SCHEMA).toHaveProperty(key)
        })
    })

    describe('useAttributeOptionComboSelection', () => {
        it('should pass the same key to "useQueryParam" as is defined in the PARAMS_SCHEMA', () => {
            useAttributeOptionComboSelection()

            const key = 'attributeOptionComboSelection'
            expect(useQueryParam.mock.calls[0]).toEqual(
                expect.arrayContaining([key])
            )
            expect(PARAMS_SCHEMA).toHaveProperty(key)
        })
    })

    describe('useSectionFilter', () => {
        it('should pass the same key to "useQueryParam" as is defined in the PARAMS_SCHEMA', () => {
            useSectionFilter()

            const key = 'sectionFilter'
            expect(useQueryParam.mock.calls[0]).toEqual(
                expect.arrayContaining([key])
            )
            expect(PARAMS_SCHEMA).toHaveProperty(key)
        })
    })
})
