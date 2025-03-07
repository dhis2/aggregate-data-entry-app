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
    const [
        {
            attributeOptionComboSelection,
            dataSetId,
            orgUnitId,
            periodId,
            sectionFilter,
        },
    ] = useContextSelection()

    const attributeOptions = Object.values(attributeOptionComboSelection)
    // generate an identifier based on the context-selection
    return getContextSelectionId({
        attributeOptions,
        dataSetId,
        orgUnitId,
        periodId,
        sectionFilter,
    })
}

export const getContextSelectionId = ({
    attributeOptions = [],
    dataSetId,
    orgUnitId,
    periodId,
    sectionFilter,
}) => {
    // Sort these to produce consistent results
    const joinedAttributeOptions = attributeOptions.sort().join(';')
    return [
        joinedAttributeOptions,
        dataSetId,
        orgUnitId,
        periodId,
        sectionFilter,
    ]
        .filter((i) => i !== undefined)
        .join()
}

export const parseContextSelectionId = (contextSelectionId) => {
    const [attributeOptions, dataSetId, orgUnitId, periodId] =
        contextSelectionId.split(',')

    return { attributeOptions, dataSetId, orgUnitId, periodId }
}
