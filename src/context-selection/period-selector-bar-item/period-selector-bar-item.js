import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { usePeriod } from '../../shared/index.js'
import { useDataSetId, usePeriodId } from '../use-context-selection.js'
import computeMaxYear from './compute-max-year.js'
import PeriodMenu from './period-menu.js'
import useDataSetPeriodType from './use-data-set-period-type.js'
import useDeselectOnPeriodTypeChange from './use-deselect-on-period-type-change.js'
import YearNavigator from './year-navigator.js'

export const PERIOD = 'PERIOD'

export const PeriodSelectorBarItem = () => {
    const [periodOpen, setPeriodOpen] = useState(false)
    const [periodId, setPeriodId] = usePeriodId()
    const [dataSetId] = useDataSetId()
    const {
        loadingDataSetPeriodType,
        errorDataSetPeriodType,
        dataSetPeriodType,
    } = useDataSetPeriodType()

    const [maxYear, setMaxYear] = useState(() =>
        computeMaxYear(dataSetPeriodType)
    )

    const selectedPeriod = usePeriod(periodId)
    const [year, setYear] = useState(selectedPeriod?.year || maxYear)

    useEffect(() => {
        if (selectedPeriod?.year) {
            setYear(selectedPeriod.year)
        }
    }, [selectedPeriod?.year])

    useEffect(() => {
        if (dataSetPeriodType) {
            const newMaxYear = computeMaxYear(dataSetPeriodType)
            setMaxYear(newMaxYear)

            if (!selectedPeriod?.year) {
                setYear(newMaxYear)
            }
        }
    }, [dataSetPeriodType])

    const selectorBarItemValue = loadingDataSetPeriodType
        ? i18n.t('Fetching data set info')
        : errorDataSetPeriodType
        ? i18n.t('Error occurred while loading data set info')
        : selectedPeriod?.displayName

    useDeselectOnPeriodTypeChange()

    return (
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
                    <YearNavigator
                        maxYear={maxYear}
                        year={year}
                        onYearChange={(year) => {
                            setPeriodId(null)
                            setYear(year)
                        }}
                    />

                    <PeriodMenu
                        onChange={({ selected }) => {
                            setPeriodId(selected)
                            setPeriodOpen(false)
                        }}
                        periodType={dataSetPeriodType}
                        year={year}
                    />
                </>
            ) : (
                <div />
            )}
        </SelectorBarItem>
    )
}
