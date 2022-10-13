import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import {
    yearlyPeriodTypes,
    selectors,
    useMetadata,
    usePeriod,
    useDataSetId,
    usePeriodId,
    getCurrentDate,
    formatJsDateToDateString,
    useClientServerDate,
} from '../../shared/index.js'
import DisabledTooltip from './disabled-tooltip.js'
import PeriodMenu from './period-menu.js'
import { useDateLimit } from './use-date-limit.js'
import usePeriods from './use-periods.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import YearNavigator from './year-navigator.js'

export const PERIOD = 'PERIOD'

const getMaxYear = (dateLimit) => {
    // periods run up to, but not including dateLimit, so decrement by 1 ms in case limit is 1 January
    return new Date(dateLimit - 1).getUTCFullYear()
}

export const PeriodSelectorBarItem = () => {
    const currentDate = getCurrentDate()
    const clientServerDate = useClientServerDate({ clientDate: currentDate })
    const adjustedCurrentDateString = formatJsDateToDateString(
        clientServerDate.serverDate
    )
    const currentFullYear = parseInt(adjustedCurrentDateString.split('-')[0])
    const [periodOpen, setPeriodOpen] = useState(false)
    const [periodId, setPeriodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const dataSetPeriodType = dataSet?.periodType
    const openFuturePeriods = dataSet?.openFuturePeriods || 0

    const [year, setYear] = useState(selectedPeriod?.year || currentFullYear)

    const dateLimit = useDateLimit()

    const [maxYear, setMaxYear] = useState(() => getMaxYear(dateLimit))
    const periods = usePeriods({
        periodType: dataSetPeriodType,
        periodId,
        openFuturePeriods,
        year,
        dateLimit,
    })

    useEffect(() => {
        if (selectedPeriod?.year) {
            setYear(selectedPeriod.year)
        }
    }, [selectedPeriod?.year])

    useEffect(() => {
        if (dataSetPeriodType) {
            const newMaxYear = getMaxYear(dateLimit)
            setMaxYear(newMaxYear)

            if (!selectedPeriod?.year) {
                setYear(currentFullYear)
            }
        }
    }, [dataSetPeriodType, selectedPeriod?.year, dateLimit, currentFullYear])

    const selectorBarItemValue = useSelectorBarItemValue()

    return (
        <div data-test="period-selector">
            <DisabledTooltip>
                <SelectorBarItem
                    disabled={!dataSetId}
                    label={i18n.t('Period')}
                    value={periodId ? selectorBarItemValue : undefined}
                    open={periodOpen}
                    setOpen={setPeriodOpen}
                    noValueMessage={i18n.t('Choose a period')}
                >
                    {year ? (
                        <>
                            {!yearlyPeriodTypes.includes(dataSetPeriodType) && (
                                <YearNavigator
                                    maxYear={maxYear}
                                    year={year}
                                    onYearChange={(year) => setYear(year)}
                                />
                            )}

                            <PeriodMenu
                                periods={periods}
                                onChange={({ selected }) => {
                                    setPeriodId(selected)
                                    setPeriodOpen(false)
                                }}
                            />
                        </>
                    ) : (
                        <div />
                    )}
                </SelectorBarItem>
            </DisabledTooltip>
        </div>
    )
}
