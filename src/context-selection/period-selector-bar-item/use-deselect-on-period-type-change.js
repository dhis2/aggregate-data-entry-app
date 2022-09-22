import { useEffect, useState } from 'react'
import { parsePeriodId, useDataSetId, usePeriodId } from '../../shared/index.js'

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
export default function useDeselectOnPeriodTypeChange(dataSetPeriodType) {
    const [periodId, setPeriodId] = usePeriodId()
    const [previousPeriodType, setPreviousPeriodType] = useState(
        convertPeriodIdToPeriodType(periodId)
    )
    const [dataSetId] = useDataSetId()

    useEffect(() => {
        if (previousPeriodType !== dataSetPeriodType) {
            if (periodId) {
                setPeriodId(undefined)
            }

            setPreviousPeriodType(dataSetPeriodType)
        }
    }, [
        setPeriodId,
        dataSetPeriodType,
        dataSetId,
        periodId,
        previousPeriodType,
    ])
}
