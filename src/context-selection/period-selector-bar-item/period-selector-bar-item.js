import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { selectors, useMetadata } from '../../metadata/index.js'
import { usePeriod } from '../../shared/index.js'
import { useDataSetId, usePeriodId } from '../use-context-selection/index.js'
import computeMaxYear from './compute-max-year.js'
import DisabledTooltip from './disabled-tooltip.js'
import PeriodMenu from './period-menu.js'
import useDeselectOnPeriodTypeChange from './use-deselect-on-period-type-change.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import YearNavigator from './year-navigator.js'

export const PERIOD = 'PERIOD'

export const PeriodSelectorBarItem = () => {
    const [periodOpen, setPeriodOpen] = useState(false)
    const [periodId, setPeriodId] = usePeriodId()
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const dataSetPeriodType = dataSet?.periodType

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
    }, [dataSetPeriodType, selectedPeriod?.year])

    const selectorBarItemValue = useSelectorBarItemValue()

    useDeselectOnPeriodTypeChange(dataSetPeriodType)

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
                                    onYearChange={(year) => {
                                        setPeriodId(null)
                                        setYear(year)
                                    }}
                                />
                            )}

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
            </DisabledTooltip>
        </div>
    )
}
