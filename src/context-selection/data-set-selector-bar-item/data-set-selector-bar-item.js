import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import { MenuSelect } from '../menu-select/index.js'
import { useDataSetId } from '../use-context-selection/index.js'
import useDataSet from './use-data-set.js'
import useSelectableDataSets from './use-selectable-data-sets.js'

/**
 * @TODO: How to indicate that the data set is being loaded
 *  -> Talk to @joe-cooper
 *
 * @TODO: How to indicate that the selecatable data sets are being loaded
 *  -> Talk to @joe-cooper
 */
export default function DataSetSelectorBarItem() {
    const [dataSetOpen, setDataSetOpen] = useState(false)
    const [dataSetId, setDataSetId] = useDataSetId()

    // Select the first item if there's only one
    const selectOnlyItemOnComplete = (data) => {
        if (data?.length === 1) {
            const { id } = data[0]
            setDataSetId(id)
        }
    }

    const dataSet = useDataSet()
    const selectableDataSets = useSelectableDataSets({
        onSuccess: selectOnlyItemOnComplete,
    })

    const isDoneLoading =
        selectableDataSets.called &&
        !selectableDataSets.loading &&
        !selectableDataSets.error

    const showLoadingMessage =
        !selectableDataSets.called || !!selectableDataSets.loading

    return (
        <div data-test="data-set-selector">
            <SelectorBarItem
                label={i18n.t('Data set')}
                value={dataSetId ? dataSet.data?.displayName : undefined}
                open={dataSetOpen}
                setOpen={setDataSetOpen}
                noValueMessage={i18n.t('Choose a data set')}
            >
                <div data-test="data-set-selector-contents">
                    {showLoadingMessage && (
                        <span data-test="data-set-selector-loading-msg">
                            {i18n.t('Fetching data sets')}
                        </span>
                    )}

                    {selectableDataSets.error && (
                        <span data-test="data-set-selector-error-msg">
                            {i18n.t('Error occurred while loading data sets')}
                        </span>
                    )}

                    {isDoneLoading && !selectableDataSets.data?.length && (
                        <span data-test="data-set-selector-none-available-msg">
                            {i18n.t('There are no data sets available!')}
                        </span>
                    )}

                    {isDoneLoading && !!selectableDataSets.data?.length && (
                        <MenuSelect
                            values={selectableDataSets.data || []}
                            selected={dataSetId}
                            dataTest="data-set-selector-menu"
                            onChange={({ selected }) => {
                                setDataSetId(selected)
                                setDataSetOpen(false)
                            }}
                        />
                    )}
                </div>
            </SelectorBarItem>
        </div>
    )
}
