import { useMemo } from 'react'
import {
    getFixedPeriodsForTypeAndDateRange,
    addFullPeriodTimeToDate,
    removeFullPeriodTimeToDate,
    selectors,
    useDataSetId,
    useMetadata,
    useCurrentDateStringAtServerTimezone,
} from '../../shared/index.js'

export const computeDateLimit = ({
    dataSetId,
    metadata,
    adjustedCurrentDateString,
}) => {
    const dateAtServerTimeZone = new Date(adjustedCurrentDateString)
    if (!dataSetId) {
        return dateAtServerTimeZone
    }

    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const periodType = dataSet?.periodType
    const openFuturePeriods = dataSet?.openFuturePeriods || 0

    if (openFuturePeriods <= 0) {
        return dateAtServerTimeZone
    }

    // will only get the current period
    const [currentPeriod] = getFixedPeriodsForTypeAndDateRange({
        periodType,
        startDate: removeFullPeriodTimeToDate(dateAtServerTimeZone, periodType),
        endDate: dateAtServerTimeZone,
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
    const adjustedCurrentDateString = useCurrentDateStringAtServerTimezone()

    return useMemo(
        () =>
            computeDateLimit({
                dataSetId,
                metadata,
                adjustedCurrentDateString,
            }),
        [dataSetId, metadata, adjustedCurrentDateString]
    )
}
