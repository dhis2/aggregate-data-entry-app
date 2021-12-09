import { SelectorBarItem } from '@dhis2-ui/selector-bar'
import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
import { useQueryParam } from 'use-query-params'
import * as constants from '../contants.js'
import { MenuSelect } from '../menu-select/index.js'
import { PARAMS_SCHEMA } from '../use-context-selection.js'
import useDataSet from './use-data-set.js'
import useSelectableDataSets from './use-selectable-data-sets.js'

const DataSetSelectorBarItem = () => {
    const [dataSetOpen, setDataSetOpen] = useState(false)
    const [dataSetId, setDataSetId] = useQueryParam(
        constants.PARAM_DATA_SET_ID,
        PARAMS_SCHEMA[constants.PARAM_DATA_SET_ID]
    )

    const { fetchingDataSet, errorDataSet, dataSet } = useDataSet(dataSetId)

    const {
        fetchingSelectableDataSets,
        errorSelectableDataSets,
        selectableDataSets,
    } = useSelectableDataSets()

    const selectorBarItemValue = fetchingDataSet
        ? i18n.t('Fetching data set info')
        : errorDataSet
        ? i18n.t('Error occurred while fetching data set info')
        : dataSet?.displayName

    return (
        <SelectorBarItem
            label={i18n.t('Data set')}
            value={selectorBarItemValue}
            open={dataSetOpen}
            setOpen={setDataSetOpen}
            noValueMessage={i18n.t('Choose a data set')}
        >
            {fetchingSelectableDataSets && i18n.t('Fetching data sets')}
            {errorSelectableDataSets &&
                i18n.t('Error occurred while fetching data sets')}
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

export default DataSetSelectorBarItem
