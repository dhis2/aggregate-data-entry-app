import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import {
    getCurrentDate,
    selectors,
    useMetadata,
    usePeriod,
    useDataSetId,
    usePeriodId,
} from '../../shared/index.js'
import DisabledTooltip from './disabled-tooltip.js'
import PeriodMenu from './period-menu.js'
import useFuturePeriods from './use-future-periods.js'
import usePeriods from './use-periods.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import YearNavigator from './year-navigator.js'

export const PERIOD = 'PERIOD'

function getMaxYear(futurePeriods) {
    if (!futurePeriods.length) {
        return getCurrentDate().getFullYear()
    }

    return new Date(
        futurePeriods[futurePeriods.length - 1].startDate
    ).getFullYear()
}

export const PeriodSelectorBarItem = () => {
    const [periodOpen, setPeriodOpen] = useState(false)
    const [periodId, setPeriodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const dataSetPeriodType = dataSet?.periodType
    const openFuturePeriods = dataSet?.openFuturePeriods

    const [year, setYear] = useState(
        selectedPeriod?.year || getCurrentDate().getFullYear()
    )

    const futurePeriods = useFuturePeriods()
    const [maxYear, setMaxYear] = useState(() => getMaxYear(futurePeriods))
    const periods = usePeriods({
        periodType: dataSetPeriodType,
        periodId,
        futurePeriods,
        openFuturePeriods,
        year,
    })

    useEffect(() => {
        if (selectedPeriod?.year) {
            setYear(selectedPeriod.year)
        }
    }, [selectedPeriod?.year])

    useEffect(() => {
        if (dataSetPeriodType) {
            const newMaxYear = getMaxYear(futurePeriods)
            setMaxYear(newMaxYear)

            if (!selectedPeriod?.year) {
                setYear(getCurrentDate().getFullYear())
            }
        }
    }, [
        dataSetPeriodType,
        selectedPeriod?.year,
        openFuturePeriods,
        futurePeriods,
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
                            {dataSetPeriodType !== 'Yearly' && (
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
