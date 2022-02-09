import { useEffect, useState } from 'react'
import { parsePeriodId } from '../../shared/index.js'
import { useDataSetPeriodType } from '../period-selector-bar-item/index.js'
import { useDataSetId, usePeriodId } from '../use-context-selection/index.js'

const convertPeriodIdToPeriodType = (periodId) => {
    if (!periodId) {
        return ''
    }

    return parsePeriodId(periodId)?.periodType?.type || ''
}

/**
 * If the period type changes, we need to deselect the current selection. As
 * the different selectors should be self-contained / isolated, I put this
 * logic into the category option combo module
 */
export default function useDeselectOnPeriodTypeChange() {
    const [periodId, setPeriodId] = usePeriodId()
    const [previousPeriodType, setPreviousPeriodType] = useState(
        convertPeriodIdToPeriodType(periodId)
    )
    const [dataSetId] = useDataSetId()
    const dataSetPeriodType = useDataSetPeriodType()

    useEffect(() => {
        if (
            !dataSetPeriodType.loading &&
            !dataSetPeriodType.error &&
            previousPeriodType !== dataSetPeriodType.data
        ) {
            setPeriodId(undefined)
            setPreviousPeriodType(dataSetPeriodType.data)
        }
    }, [
        dataSetPeriodType.loading,
        dataSetPeriodType.error,
        dataSetPeriodType.data,
        dataSetId,
        previousPeriodType,
    ])
}
