import { useAlert, useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { useEffect, useState } from 'react'
import { useMetadata, selectors } from '../metadata/index.js'
import { periodTypesMapping } from '../period/index.js'
import { useOrgUnit } from '../use-org-unit/use-organisation-unit.js'
import { filterObject } from '../utils.js'
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

function convertPeriodIdToPeriodType(periodId, calendar) {
    if (!periodId) {
        return ''
    }

    // Prevents invalid periods from throwing a runtime error. If this happens,
    // the app simply dismisses the invalid period id and notifies the user
    try {
        const periodType = createFixedPeriodFromPeriodId({
            periodId,
            calendar,
        })?.periodType
        return periodType || ''
    } catch (e) {
        console.error(e)
        return ''
    }
}

function useHandleDataSetIdChange() {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    const [periodId, setPeriodId] = usePeriodId()
    const [previousPeriodType, setPreviousPeriodType] = useState(() =>
        convertPeriodIdToPeriodType(periodId, calendar)
    )
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()
    const [dataSetId, setDataSetId] = useDataSetId()
    const [prevDataSetId, setPrevDataSetId] = useState(dataSetId)
    const [orgUnitId, setOrgUnitId] = useOrgUnitId()
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const {
        organisationUnits: assignedOrgUnits,
        periodType: dataSetPeriodTypeRaw,
    } = selectors.getDataSetById(metadata, dataSetId) || {}
    const dataSetPeriodType = periodTypesMapping[dataSetPeriodTypeRaw]

    const { show: showWarningAlert } = useAlert((message) => message, {
        warning: true,
    })

    useEffect(() => {
        if (dataSetId && !dataSet) {
            showWarningAlert(
                i18n.t(
                    'There was a problem loading the {{objectType}} selection ({{id}}). You might not have access, or the selection might be invalid.',
                    {
                        objectType: 'Data Set',
                        id: dataSetId,
                    }
                )
            )
            setDataSetId(undefined)
            setPeriodId(undefined)
            setOrgUnitId(undefined)
            setAttributeOptionComboSelection(undefined)
        }
        if (dataSetId !== prevDataSetId) {
            // unset period if new data set has a different period type
            if (previousPeriodType !== dataSetPeriodType) {
                setPeriodId(undefined)
                setPreviousPeriodType(dataSetPeriodType)
            }

            // unset attribute options
            setAttributeOptionComboSelection(undefined)

            // if orgUnit is not assigned to dataset, clear out orgUnit assignment
            if (
                orgUnitId !== undefined &&
                !assignedOrgUnits?.includes(orgUnitId)
            ) {
                setOrgUnitId(undefined)
            }

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
        assignedOrgUnits,
        setOrgUnitId,
        orgUnitId,
        dataSet,
        setDataSetId,
        showWarningAlert,
    ])
}

function useHandleOrgUnitIdChange() {
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const [prevOrgUnitId, setPrevOrgUnitId] = useState(orgUnitId)
    const { data: orgUnitData } = useOrgUnit()
    const orgUnitPath = orgUnitData?.path
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    const relevantCategoriesWithOptions =
        selectors.getCategoriesWithOptionsWithinPeriodWithOrgUnit(
            metadata,
            dataSetId,
            periodId,
            orgUnitId,
            orgUnitPath,
            calendar
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
        ([categoryId, optionId]) =>
            relevantCategoriesWithOptions.find(
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
    const [orgUnitId] = useOrgUnitId()
    const { data: orgUnitData } = useOrgUnit()
    const orgUnitPath = orgUnitData?.path
    const [periodId] = usePeriodId()
    const [prevPeriodId, setPrevPeriodId] = useState(periodId)
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    const relevantCategoriesWithOptions =
        selectors.getCategoriesWithOptionsWithinPeriodWithOrgUnit(
            metadata,
            dataSetId,
            periodId,
            orgUnitId,
            orgUnitPath,
            calendar
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
