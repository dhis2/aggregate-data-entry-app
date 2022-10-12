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
    useConvertClientDateAtServerTimezone,
} from '../../shared/index.js'

export const computeDateLimit = ({
    dataSetId,
    metadata,
    convertClientDateAtServerTimezone,
}) => {
    const currentDateAtServerTimezone = convertClientDateAtServerTimezone(
        getCurrentDate()
    )

    if (!dataSetId) {
        return currentDateAtServerTimezone
    }

    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const periodType = dataSet?.periodType
    const openFuturePeriods = dataSet?.openFuturePeriods || 0

    if (openFuturePeriods <= 0) {
        return currentDateAtServerTimezone
    }

    // will only get the current period
    const [currentPeriod] = getFixedPeriodsForTypeAndDateRange({
        periodType,
        startDate: removeFullPeriodTimeToDate(
            currentDateAtServerTimezone,
            periodType
        ),
        endDate: currentDateAtServerTimezone,
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
    const convertClientDateAtServerTimezone = useConvertClientDateAtServerTimezone()
    const currentDateAtServerTimezone = convertClientDateAtServerTimezone(
        getCurrentDate()
    )
    const dateWithoutTime = formatJsDateToDateString(currentDateAtServerTimezone)

    return useMemo(
        () => computeDateLimit({
            dataSetId,
            metadata,
            convertClientDateAtServerTimezone,
        }),

        // Adding `dateWithoutTime` to the dependency array so this hook will
        // recompute the date limit when the actual date changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataSetId, metadata, dateWithoutTime, convertClientDateAtServerTimezone]
    )
}
