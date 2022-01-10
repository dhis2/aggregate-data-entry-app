import { useEffect, useState } from 'react'
import { useDataSetPeriodType } from '../period-selector-bar-item/index.js'
import {
    useCategoryOptionComboSelection,
    useDataSetId,
} from '../use-context-selection/index.js'

/**
 * If the period type changes, we need to deselect the current selection. As
 * the different selectors should be self-contained / isolated, I put this
 * logic into the category option combo module
 */
export default function useDeselectOnPeriodTypeChange() {
    const [initialExecution, setInitialExecution] = useState(true)
    const [previousPeriodType, setPreviousPeriodType] = useState('')
    const [dataSetId] = useDataSetId()
    const { loadingDataSetPeriodType, errorDataSetPeriodType, periodType } =
        useDataSetPeriodType()
    const [, setCategoryOptionComboSelection] =
        useCategoryOptionComboSelection()

    useEffect(() => {
        if (
            !loadingDataSetPeriodType &&
            !errorDataSetPeriodType &&
            initialExecution &&
            previousPeriodType !== periodType
        ) {
            setInitialExecution(false)
            setCategoryOptionComboSelection([])
            setPreviousPeriodType(periodType)
        }
    }, [
        loadingDataSetPeriodType,
        errorDataSetPeriodType,
        dataSetId,
        initialExecution,
        previousPeriodType,
    ])
}
