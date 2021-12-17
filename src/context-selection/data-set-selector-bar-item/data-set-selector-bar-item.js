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
    const { loadingDataSet, errorDataSet, dataSet } = useDataSet()

    const {
        loadingSelectableDataSets,
        errorSelectableDataSets,
        selectableDataSets,
    } = useSelectableDataSets()

    const selectorBarItemValue = loadingDataSet
        ? i18n.t('Fetching data set info')
        : errorDataSet
        ? i18n.t('Error occurred while loading data set info')
        : dataSet?.displayName

    return (
        <SelectorBarItem
            label={i18n.t('Data set')}
            value={dataSetId ? selectorBarItemValue : undefined}
            open={dataSetOpen}
            setOpen={setDataSetOpen}
            noValueMessage={i18n.t('Choose a data set')}
        >
            {loadingSelectableDataSets && i18n.t('Fetching data sets')}
            {errorSelectableDataSets &&
                i18n.t('Error occurred while loading data sets')}
            {selectableDataSets && (
                <MenuSelect
                    values={selectableDataSets}
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
