import { useMemo } from 'react'
import {
    getFixedPeriodsForTypeAndDateRange,
    addFullPeriodTimeToDate,
    removeFullPeriodTimeToDate,
    selectors,
    useDataSetId,
    useMetadata,
    formatJsDateToDateString,
    getCurrentDate,
    useClientServerDateUtils,
    useClientServerDate,
} from '../../shared/index.js'

export const computeDateLimit = ({ dataSetId, metadata, fromClientDate }) => {
    const currentDateAtServerTimezone = fromClientDate(getCurrentDate())

    if (!dataSetId) {
        return currentDateAtServerTimezone.serverDate
    }

    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const periodType = dataSet?.periodType
    const openFuturePeriods = dataSet?.openFuturePeriods || 0

    if (openFuturePeriods <= 0) {
        return currentDateAtServerTimezone.serverDate
    }

    // will only get the current period
    const [currentPeriod] = getFixedPeriodsForTypeAndDateRange({
        periodType,
        startDate: removeFullPeriodTimeToDate(
            currentDateAtServerTimezone.serverDate,
            periodType
        ),
        endDate: currentDateAtServerTimezone.serverDate,
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
    const { fromClientDate } = useClientServerDateUtils()
    const clientServerDate = useClientServerDate()
    const dateWithoutTime = formatJsDateToDateString(
        clientServerDate.serverDate
    )

    return useMemo(
        () =>
            computeDateLimit({
                dataSetId,
                metadata,
                fromClientDate,
            }),

        // Adding `dateWithoutTime` to the dependency array so this hook will
        // recompute the date limit when the actual date changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataSetId, metadata, dateWithoutTime, fromClientDate]
    )
}
