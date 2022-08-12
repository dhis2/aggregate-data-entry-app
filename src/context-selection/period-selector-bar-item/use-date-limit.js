import { useMemo } from 'react'
import {
    getCurrentDate,
    getFixedPeriodsForTypeAndDateRange,
    addFullPeriodTimeToDate,
    removeFullPeriodTimeToDate,
    selectors,
    useDataSetId,
    useMetadata,
} from '../../shared/index.js'

export const computeDateLimit = ({ dataSetId, metadata }) => {
    const now = getCurrentDate()

    if (!dataSetId) {
        return now
    }

    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const periodType = dataSet?.periodType
    const openFuturePeriods = dataSet?.openFuturePeriods || 0

    if (openFuturePeriods <= 0) {
        return now
    }

    // will only get the current period
    const [currentPeriod] = getFixedPeriodsForTypeAndDateRange({
        periodType,
        startDate: removeFullPeriodTimeToDate(now, periodType),
        endDate: now,
    })

    let startDateLimit = new Date(currentPeriod.startDate)

    for (let i = 0; i <= openFuturePeriods; ++i) {
        startDateLimit = addFullPeriodTimeToDate(startDateLimit, periodType)
    }
    return startDateLimit
}

export const useDateLimit = () => {
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()

    return useMemo(
        () =>
            computeDateLimit({
                dataSetId,
                metadata,
            }),
        [dataSetId, metadata]
    )
}
