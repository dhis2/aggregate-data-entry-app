import { useEffect, useState, useRef } from 'react'
import { useDataSetPeriodType } from '../period-selector-bar-item/index.js'
import {
    useAttributeOptionComboSelection,
    useDataSetId,
} from '../use-context-selection/index.js'

/**
 * If the period type changes, we need to deselect the current selection. As
 * the different selectors should be self-contained / isolated, I put this
 * logic into the category option combo module
 */
export default function useDeselectOnPeriodTypeChange() {
    const initialExecution = useRef(true)
    const [previousPeriodType, setPreviousPeriodType] = useState('')
    const [dataSetId] = useDataSetId()
    const { loadingDataSetPeriodType, errorDataSetPeriodType, periodType } =
        useDataSetPeriodType()
    const [, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()

    useEffect(() => {
        if (initialExecution.current) {
            initialExecution.current = false
        } else if (
            !loadingDataSetPeriodType &&
            !errorDataSetPeriodType &&
            previousPeriodType !== periodType
        ) {
            setAttributeOptionComboSelection(undefined)
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
