import { useCallback, useEffect, useState } from 'react'
import {
    ObjectParam,
    StringParam,
    useQueryParams,
    useQueryParam,
    withDefault,
} from 'use-query-params'
import { useMetadata, selectors } from '../../metadata/index.js'
import { parsePeriodId } from '../../shared/index.js'

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

export function useManageInterParamDependencies() {
    useHandleDataSetIdChange()
    useHandleOrgUnitIdChange()
    useHandlePeriodIdChange()
    useHandleAttributeOptionComboSelectionChange()
    useHandleSectionFilterChange()
}

const convertPeriodIdToPeriodType = (periodId) => {
    if (!periodId) {
        return ''
    }

    return parsePeriodId(periodId)?.periodType?.type || ''
}

function useHandleDataSetIdChange() {
    const [periodId, setPeriodId] = usePeriodId()
    const [previousPeriodType, setPreviousPeriodType] = useState(
        convertPeriodIdToPeriodType(periodId)
    )
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()
    const [dataSetId] = useDataSetId()
    const [prevDataSetId, setPrevDataSetId] = useState(dataSetId)
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const dataSetPeriodType = dataSet?.periodType

    useEffect(() => {
        if (dataSetId !== prevDataSetId) {
            // unset period if new data set has a different period type
            if (previousPeriodType !== dataSetPeriodType) {
                setPeriodId(undefined)
                setPreviousPeriodType(dataSetPeriodType)
            }

            // unset attribute options
            setAttributeOptionComboSelection(undefined)

            setPrevDataSetId(dataSetId)
        }
    }, [
        dataSetId,
        prevDataSetId,
        setPrevDataSetId,
        dataSetPeriodType,
        periodId,
        previousPeriodType,
        setPeriodId,
        attributeOptionComboSelection,
        setAttributeOptionComboSelection,
    ])
}

function useHandleOrgUnitIdChange() {
    const [orgUnitId] = useOrgUnitId()
    const [prevOrgUnitId, setPrevOrgUnitId] = useState(orgUnitId)
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()

    useEffect(() => {
        if (orgUnitId !== prevOrgUnitId) {
            // unset attribute options
            setAttributeOptionComboSelection(undefined)

            setPrevOrgUnitId(orgUnitId)
        }
    }, [
        orgUnitId,
        prevOrgUnitId,
        setPrevOrgUnitId,
        attributeOptionComboSelection,
        setAttributeOptionComboSelection,
    ])
}

function deselectAllUnavailableCategoryOptions({
    attributeOptionComboSelection,
    relevantCategoriesWithOptions,
    setAttributeOptionComboSelection,
}) {
    const nextAocSelection = Object.fromEntries(
        Object.entries(attributeOptionComboSelection).filter(
            ([categoryId, optionId]) => {
                return relevantCategoriesWithOptions.find(
                    (category) =>
                        category.id === categoryId &&
                        category.categoryOptions.find(
                            (categoryOption) => categoryOption.id === optionId
                        )
                )
            }
        )
    )

    // prevent infinite loop as the object reference it not stored
    // ---
    // Note by @Mohammer5: This confused me quite a bit, I tried to
    // create a custom implementation of use-query-params to see if it
    // was an issue with the library and figured that it's indeed
    // quite a PITA to ensure that the default value's reference
    // is kept intact...
    if (
        JSON.stringify(attributeOptionComboSelection) ===
        JSON.stringify(nextAocSelection)
    ) {
        return
    }

    setAttributeOptionComboSelection(
        JSON.stringify(nextAocSelection) === '{}'
            ? // passing an empty object will result in an infinite loop,
              // breaking the app. Additionally `undefined` will remove
              // the parameter from the url
              undefined
            : nextAocSelection
    )
}

function useHandlePeriodIdChange() {
    const { data: metadata } = useMetadata()
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [prevPeriodId, setPrevPeriodId] = useState(periodId)
    const relevantCategoriesWithOptions =
        selectors.getCategoriesWithOptionsWithinPeriod(
            metadata,
            dataSetId,
            periodId
        )

    useEffect(() => {
        if (periodId !== prevPeriodId) {
            // Will deselect all options that have a start- and end-date and are out
            // of bounds
            deselectAllUnavailableCategoryOptions({
                attributeOptionComboSelection,
                relevantCategoriesWithOptions,
                setAttributeOptionComboSelection,
            })

            setPrevPeriodId(periodId)
        }
    }, [
        periodId,
        prevPeriodId,
        setPrevPeriodId,
        attributeOptionComboSelection,
        relevantCategoriesWithOptions,
        setAttributeOptionComboSelection,
    ])
}

function useHandleAttributeOptionComboSelectionChange() {
    const [attributeOptionComboSelection] = useAttributeOptionComboSelection()
    const [
        prevAttributeOptionComboSelection,
        setPrevAttributeOptionComboSelection,
    ] = useState(attributeOptionComboSelection)
    useEffect(() => {
        if (
            JSON.stringify(attributeOptionComboSelection) !==
            JSON.stringify(prevAttributeOptionComboSelection)
        ) {
            // handle data set id change
            setPrevAttributeOptionComboSelection(attributeOptionComboSelection)
        }
    }, [
        attributeOptionComboSelection,
        prevAttributeOptionComboSelection,
        setPrevAttributeOptionComboSelection,
    ])
}

function useHandleSectionFilterChange() {
    const [sectionFilter] = useSectionFilter()
    const [prevSectionFilter, setPrevSectionFilter] = useState(sectionFilter)
    useEffect(() => {
        if (sectionFilter !== prevSectionFilter) {
            // handle data set id change
            setPrevSectionFilter(sectionFilter)
        }
    }, [sectionFilter, prevSectionFilter, setPrevSectionFilter])
}
