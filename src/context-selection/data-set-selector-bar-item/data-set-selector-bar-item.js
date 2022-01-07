import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import { MenuSelect } from '../menu-select/index.js'
import { useDataSetId } from '../use-context-selection.js'
import useDataSet from './use-data-set.js'
import useSelectableDataSets from './use-selectable-data-sets.js'

export default function DataSetSelectorBarItem() {
    const [dataSetOpen, setDataSetOpen] = useState(false)
    const [dataSetId, setDataSetId] = useDataSetId()
    const dataSet = useDataSet()
    const selectableDataSets = useSelectableDataSets()

    const selectorBarItemValue = dataSet.loading
        ? i18n.t('Fetching data set info')
        : dataSet.error
        ? i18n.t('Error occurred while loading data set info')
        : dataSet.data?.displayName

    const renderMenu = (
        selectableDataSets.called &&
        !selectableDataSets.loading &&
        !selectableDataSets.error &&
        selectableDataSets.data
    )

    return (
        <SelectorBarItem
            label={i18n.t('Data set')}
            value={dataSetId ? selectorBarItemValue : undefined}
            open={dataSetOpen}
            setOpen={setDataSetOpen}
            noValueMessage={i18n.t('Choose a data set')}
        >
            {selectableDataSets.loading &&
                i18n.t('Fetching data sets')}

            {selectableDataSets.error &&
                i18n.t('Error occurred while loading data sets')}

            {renderMenu && (
                <MenuSelect
                    values={selectableDataSets.data}
                    selected={dataSetId}
                    onChange={({ selected }) => {
                        setDataSetId(selected)
                        setDataSetOpen(false)
                    }}
                />
            )}
        </SelectorBarItem>
    )
}
