import { useAlert, useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { getNowInCalendar } from '@dhis2/multi-calendar-dates'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import {
    selectors,
    useMetadata,
    usePeriod,
    useDataSetId,
    usePeriodId,
    periodTypesMapping,
    yearlyFixedPeriodTypes,
    isDateAGreaterThanDateB,
} from '../../shared/index.js'
import DisabledTooltip from './disabled-tooltip.js'
import PeriodMenu from './period-menu.js'
import { useDateLimit } from './use-date-limit.js'
import usePeriods from './use-periods.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import YearNavigator from './year-navigator.js'

export const PERIOD = 'PERIOD'

const getYear = (date) => {
    // return null if date is undefined (for example)
    if (typeof date !== 'string') {
        return null
    }
    const [year] = date.split('-')
    const yearNumber = Number(year)
    return isNaN(yearNumber) ? null : yearNumber
}

const getMaxYear = (dateLimit) => {
    // periods run up to, but not including dateLimit, so if limit is 1 January, max year is previous year
    // otherwise, max year is the year from the date limit
    const dateLimitYear = getYear(dateLimit)

    try {
        const [year, month, day] = dateLimit.split('-')
        if (Number(month) === 1 && Number(day) === 1) {
            return Number(year) - 1
        }
        return dateLimitYear
    } catch (e) {
        console.error(e)
        return dateLimitYear
    }
}

export const PeriodSelectorBarItem = () => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    const { eraYear: nowEraYear, year: nowYear } = getNowInCalendar(calendar)
    const currentFullYear = ['ethiopian', 'ethiopic'].includes(calendar)
        ? nowEraYear
        : nowYear

    const [periodOpen, setPeriodOpen] = useState(false)
    const [periodId, setPeriodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const dataSetPeriodType = periodTypesMapping[dataSet?.periodType]
    const openFuturePeriods = dataSet?.openFuturePeriods || 0
    const { show: showWarningAlert } = useAlert((message) => message, {
        warning: true,
    })

    const [year, setYear] = useState(
        getYear(selectedPeriod?.startDate) || currentFullYear
    )

    const dateLimit = useDateLimit()

    const [maxYear, setMaxYear] = useState(() => getMaxYear(dateLimit))

    const periods = usePeriods({
        periodType: dataSetPeriodType,
        openFuturePeriods,
        dateLimit,
        year,
    })

    useEffect(() => {
        const selectedPeriodYear = getYear(selectedPeriod?.startDate)
        if (selectedPeriodYear) {
            setYear(selectedPeriodYear)
        }
    }, [selectedPeriod?.startDate])

    useEffect(() => {
        if (dataSetPeriodType) {
            const newMaxYear = getMaxYear(dateLimit)
            setMaxYear(newMaxYear)

            const selectedPeriodYear = getYear(selectedPeriod?.startDate)
            if (!selectedPeriodYear) {
                setYear(currentFullYear)
            }
        }
    }, [
        dataSetPeriodType,
        selectedPeriod?.startDate,
        dateLimit,
        currentFullYear,
    ])

    useEffect(() => {
        const resetPeriod = (id, displayName) => {
            showWarningAlert(
                i18n.t('The Period ({{id}}) is not open or is invalid.', {
                    id: displayName ? displayName : id,
                })
            )
            setPeriodId(undefined)
        }

        if (selectedPeriod) {
            const endDate = selectedPeriod?.endDate
            const displayName = selectedPeriod?.displayName

            // date comparison
            if (
                isDateAGreaterThanDateB(endDate, dateLimit, {
                    inclusive: true,
                    calendar,
                })
            ) {
                resetPeriod(periodId, displayName)
            }

            if (selectedPeriod?.periodType !== dataSetPeriodType) {
                resetPeriod(periodId, selectedPeriod?.displayName)
            }
        } else if (periodId) {
            setPeriodId(undefined)
        }
    }, [
        selectedPeriod,
        dateLimit,
        dataSet,
        periodId,
        setPeriodId,
        showWarningAlert,
        dataSetPeriodType,
        calendar,
    ])

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
                            {!yearlyFixedPeriodTypes.includes(
                                dataSetPeriodType
                            ) && (
                                <YearNavigator
                                    maxYear={maxYear}
                                    year={year}
                                    onYearChange={(year) => setYear(year)}
                                    calendar={calendar}
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
