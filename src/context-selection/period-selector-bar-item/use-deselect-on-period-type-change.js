import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { useEffect, useState } from 'react'
import { useDataSetId, usePeriodId } from '../../shared/index.js'

const convertPeriodIdToPeriodType = (periodId) => {
    if (!periodId) {
        return ''
    }

    // @TODO(calendar)
    const calendar = 'gregory'
    try {
        return (
            createFixedPeriodFromPeriodId({ periodId: periodId, calendar })
                ?.periodType || ''
        )
    } catch (e) {
        // In case period id is invalid
        return ''
    }
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
