import { useCallback } from 'react'
import {
    ObjectParam,
    StringParam,
    useQueryParams,
    useQueryParam,
    withDefault,
} from 'use-query-params'

export const PARAMS_SCHEMA = {
    dataSetId: StringParam,
    orgUnitId: StringParam,
    periodId: StringParam,
    attributeOptionComboSelection: withDefault(ObjectParam, {}),
    sectionFilter: StringParam,
}

export function useDataSetId() {
    return useQueryParam('dataSetId', PARAMS_SCHEMA.dataSetId)
}

export function useOrgUnitId() {
    return useQueryParam('orgUnitId', PARAMS_SCHEMA.orgUnitId)
}

export function usePeriodId() {
    return useQueryParam('periodId', PARAMS_SCHEMA.periodId)
}

/**
 *
 * @returns the selected attribute-options in the shape of
 * ```{
 *   [categoryId: String]: String // categoryOptionId
 * }```
 *
 */
export function useAttributeOptionComboSelection() {
    return useQueryParam(
        'attributeOptionComboSelection',
        PARAMS_SCHEMA.attributeOptionComboSelection
    )
}

export function useSectionFilter() {
    return useQueryParam('sectionFilter', PARAMS_SCHEMA.sectionFilter)
}

export function useContextSelection() {
    return useQueryParams(PARAMS_SCHEMA)
}

export function useClearEntireSelection() {
    const [, setSelectionContext] = useContextSelection()

    return useCallback(() => {
        setSelectionContext({
            dataSetId: undefined,
            orgUnitId: undefined,
            periodId: undefined,
            attributeOptionComboSelection: undefined,
            sectionFilter: undefined,
        })
    }, [setSelectionContext])
}

/**
 *
 * @returns {string} an unique identifer for the selected context
 */
export function useContextSelectionId() {
    const [{ attributeOptionComboSelection, dataSetId, orgUnitId, periodId }] =
        useContextSelection()

    // generate an identifier based on the context-selection
    return Object.entries(attributeOptionComboSelection)
        .map((keyVal) => keyVal.join(':'))
        .concat([dataSetId, orgUnitId, periodId])
        .join()
}
