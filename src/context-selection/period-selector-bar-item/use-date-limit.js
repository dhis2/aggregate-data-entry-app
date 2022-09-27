import { useMemo } from 'react'
import {
    getFixedPeriodsForTypeAndDateRange,
    addFullPeriodTimeToDate,
    removeFullPeriodTimeToDate,
    selectors,
    useDataSetId,
    useMetadata,
    useNowAtServerTimezone,
    getCurrentDate,
} from '../../shared/index.js'

export const computeDateLimit = ({
    dataSetId,
    metadata,
    nowAtServerTimezone = getCurrentDate(),
}) => {
    if (!dataSetId) {
        return nowAtServerTimezone
    }

    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const periodType = dataSet?.periodType
    const openFuturePeriods = dataSet?.openFuturePeriods || 0

    if (openFuturePeriods <= 0) {
        return nowAtServerTimezone
    }

    // will only get the current period
    const [currentPeriod] = getFixedPeriodsForTypeAndDateRange({
        periodType,
        startDate: removeFullPeriodTimeToDate(nowAtServerTimezone, periodType),
        endDate: nowAtServerTimezone,
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
    const nowAtServerTimezone = useNowAtServerTimezone()

    return useMemo(
        () =>
            computeDateLimit({
                dataSetId,
                metadata,
                nowAtServerTimezone,
            }),
        [dataSetId, metadata, nowAtServerTimezone]
    )
}
