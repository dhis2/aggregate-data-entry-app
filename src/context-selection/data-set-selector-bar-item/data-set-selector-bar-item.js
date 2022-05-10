import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { selectors, useMetadata } from '../../metadata/index.js'
import { MenuSelect } from '../menu-select/index.js'
import { useDataSetId } from '../use-context-selection/index.js'

const DataSetSelectorBarDropDownContent = ({
    dataSets,
    dataSetId,
    dataSet,
    onChange,
}) => {
    if (dataSetId && !dataSet) {
        return (
            <span data-test="data-set-selector-no-dataset-for-id-msg">
                {i18n.t('Could not find a data set for the selected id')}
            </span>
        )
    }

    if (!dataSets.length) {
        return (
            <span data-test="data-set-selector-none-available-msg">
                {i18n.t('There are no data sets available!')}
            </span>
        )
    }

    return (
        <MenuSelect
            values={dataSets || []}
            selected={dataSetId}
            dataTest="data-set-selector-menu"
            onChange={onChange}
        />
    )
}

DataSetSelectorBarDropDownContent.propTypes = {
    dataSet: PropTypes.object,
    dataSetId: PropTypes.string,
    dataSets: PropTypes.array,
    onChange: PropTypes.func,
}

export default function DataSetSelectorBarItem() {
    const { data: metadata } = useMetadata()
    const [dataSetOpen, setDataSetOpen] = useState(false)
    const [dataSetId, setDataSetId] = useDataSetId()
    const dataSets = Object.values(selectors.getDataSets(metadata))
    const selectableDataSets = dataSets
        .map(({ id, displayName }) => ({
            label: displayName,
            value: id,
        }))
        .sort((left, right) => left.label.localeCompare(right.label))
    const dataSet = dataSets.find(({ id }) => id === dataSetId)

    // Select the first item if there's only one
    useEffect(
        () => {
            if (dataSets.length === 1) {
                setDataSetId(dataSets[0].id)
            }
        },
        // We need to do this only once
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return (
        <div data-test="data-set-selector">
            <SelectorBarItem
                label={i18n.t('Data set')}
                value={dataSetId ? dataSet.displayName : undefined}
                open={dataSetOpen}
                setOpen={setDataSetOpen}
                noValueMessage={i18n.t('Choose a data set')}
            >
                <div data-test="data-set-selector-contents">
                    <DataSetSelectorBarDropDownContent
                        dataSets={selectableDataSets}
                        dataSetId={dataSetId}
                        dataSet={dataSet}
                        onChange={({ selected }) => {
                            setDataSetId(selected)
                            setDataSetOpen(false)
                        }}
                    />
                </div>
            </SelectorBarItem>
        </div>
    )
}
