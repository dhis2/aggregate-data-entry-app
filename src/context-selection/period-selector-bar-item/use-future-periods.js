import { useMemo } from 'react'
import {
    getCurrentDate,
    getFixedPeriodsForTypeAndDateRange,
    getFollowingFixedPeriodsForPeriod,
    parsePeriodId,
    removeFullPeriodTimeToDate,
    selectors,
    useDataSetId,
    useMetadata,
    usePeriodId,
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
        // Need to use "parsePeriodId" because the periods returned by
        // getFixedPeriodsForTypeAndDateRange do not have the "periodType"
        // property
        parsePeriodId(currentPeriod.id),
        openFuturePeriods
    )

    return futurePeriods
}

export default function useFuturePeriods() {
    const [periodId] = usePeriodId()
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()

    return useMemo(
        () =>
            computeFuturePeriods({
                dataSetId,
                metadata,
                periodId,
            }),
        [dataSetId, metadata, periodId]
    )
}
