import { useEffect, useState } from 'react'
import { useMetadata, selectors } from '../../metadata/index.js'
import { parsePeriodId, filterObject } from '../../shared/index.js'
import {
    usePeriodId,
    useAttributeOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
    useSectionFilter,
} from './use-context-selection.js'

export default function useManageInterParamDependencies() {
    useHandleDataSetIdChange()
    useHandleOrgUnitIdChange()
    useHandlePeriodIdChange()
    useHandleAttributeOptionComboSelectionChange()
    useHandleSectionFilterChange()
}

function convertPeriodIdToPeriodType(periodId) {
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
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const [prevOrgUnitId, setPrevOrgUnitId] = useState(orgUnitId)
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()

    const relevantCategoriesWithOptions =
        selectors.getCategoriesWithOptionsWithinPeriod(
            metadata,
            dataSetId,
            periodId
        )

    useEffect(() => {
        if (orgUnitId !== prevOrgUnitId) {
            deselectAllUnavailableCategoryOptions({
                attributeOptionComboSelection,
                relevantCategoriesWithOptions,
                setAttributeOptionComboSelection,
            })

            setPrevOrgUnitId(orgUnitId)
        }
    }, [
        orgUnitId,
        prevOrgUnitId,
        setPrevOrgUnitId,
        attributeOptionComboSelection,
        setAttributeOptionComboSelection,
        relevantCategoriesWithOptions,
    ])
}

function deselectAllUnavailableCategoryOptions({
    attributeOptionComboSelection,
    relevantCategoriesWithOptions,
    setAttributeOptionComboSelection,
}) {
    const nextAocSelection = filterObject(
        attributeOptionComboSelection,
        ([categoryId, optionId]) => relevantCategoriesWithOptions.find(
            (category) =>
                // when current iterating is the correct category
                category.id === categoryId &&
                // and the option still exists
                category.categoryOptions.find(
                    (categoryOption) => categoryOption.id === optionId
                )
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
