import { useMemo } from 'react'
import {
    getCurrentDate,
    getFixedPeriodsForTypeAndDateRange,
    getFollowingFixedPeriodsForPeriod,
    removeFullPeriodTimeToDate,
    selectors,
    useDataSetId,
    useMetadata,
} from '../../shared/index.js'

export function computeFuturePeriods({ dataSetId, metadata }) {
    if (!dataSetId) {
        return []
    }

    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const periodType = dataSet?.periodType
    const openFuturePeriods = dataSet?.openFuturePeriods

    if (!openFuturePeriods) {
        return []
    }

    const now = getCurrentDate()

    // will only get the current period
    const [currentPeriod] = getFixedPeriodsForTypeAndDateRange({
        periodType,
        startDate: removeFullPeriodTimeToDate(now, periodType),
        endDate: now,
    })

    const futurePeriods = getFollowingFixedPeriodsForPeriod(
        // If there are no future periods, the latest period is the current one.
        // add periodType back into period
        { ...currentPeriod, periodType: periodType },
        openFuturePeriods
    )

    return futurePeriods
}

export default function useFuturePeriods() {
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()

    return useMemo(
        () =>
            computeFuturePeriods({
                dataSetId,
                metadata,
            }),
        [dataSetId, metadata]
    )
}
