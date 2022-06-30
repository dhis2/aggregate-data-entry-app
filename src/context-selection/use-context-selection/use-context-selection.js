import { useCallback } from 'react'
import {
    ObjectParam,
    StringParam,
    useQueryParams,
    useQueryParam,
    withDefault,
} from 'use-query-params'
import { useIsValidSelection } from './use-is-valid-selection.js'

export const PARAMS_SCHEMA = {
    dataSetId: StringParam,
    orgUnitId: StringParam,
    periodId: StringParam,
    attributeOptionComboSelection: withDefault(ObjectParam, {}),
    sectionFilter: StringParam,
}

const useCustomQueryParam = (name, schema) => {
    const [paramValue, setParamValue] = useQueryParam(name, schema)
    const isValidSelection = useIsValidSelection()
    const defaultUpdateType = isValidSelection ? 'pushIn' : 'replaceIn'

    const setSelection = useCallback(
        (value, updateType) => {
            return setParamValue(value, updateType || defaultUpdateType)
        },
        [setParamValue, defaultUpdateType]
    )
    return [paramValue, setSelection]
}

export function useDataSetId() {
    return useCustomQueryParam('dataSetId', PARAMS_SCHEMA.dataSetId)
}

export function useOrgUnitId() {
    return useCustomQueryParam('orgUnitId', PARAMS_SCHEMA.orgUnitId)
}

export function usePeriodId() {
    return useCustomQueryParam('periodId', PARAMS_SCHEMA.periodId)
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
    return useCustomQueryParam(
        'attributeOptionComboSelection',
        PARAMS_SCHEMA.attributeOptionComboSelection
    )
}

export function useSectionFilter() {
    return useCustomQueryParam('sectionFilter', PARAMS_SCHEMA.sectionFilter)
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
