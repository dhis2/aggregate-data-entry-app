import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Input,
    Menu,
    MenuDivider,
    MenuItem,
    SelectorBarItem,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    selectors,
    useMetadata,
    useDataSetId,
    useOrgUnitId,
} from '../../shared/index.js'
import styles from './data-set-selector-bar-item.module.css'

const FiltrableMenuItems = ({
    dataTest,
    options,
    onChange,
    searchText,
    selected,
}) => {
    const [filter, setFilter] = useState('')

    const filtered = options.reduce((acc, item) => {
        const match = item.label.toLowerCase().includes(filter.toLowerCase())
        return match ? [...acc, item] : acc
    }, [])

    const hasMatch = filtered?.length > 0

    return (
        <>
            {options.length > 1 && (
                <Input
                    dense
                    dataTest={`${dataTest}-filterinput`}
                    value={filter}
                    onChange={({ value }) => setFilter(value ?? '')}
                    type="text"
                    placeholder={searchText}
                    initialFocus
                    className={styles.input}
                />
            )}
            <div className={styles.menuSelect} data-test={dataTest}>
                <Menu>
                    {hasMatch ? (
                        filtered.map((option) => (
                            <MenuItem
                                key={option.value}
                                label={
                                    <span data-value={option.value}>
                                        {option.label}
                                    </span>
                                }
                                value={option.value}
                                suffix=""
                                onClick={() => {
                                    onChange({ selected: option.value })
                                }}
                                active={selected === option.value}
                            />
                        ))
                    ) : (
                        <div className={styles.empty}>
                            <span>
                                {i18n.t('No results found for {{filter}}', {
                                    filter,
                                })}
                            </span>
                        </div>
                    )}
                </Menu>
            </div>
        </>
    )
}

FiltrableMenuItems.propTypes = {
    dataTest: PropTypes.string,
    options: PropTypes.array,
    searchText: PropTypes.string,
    selected: PropTypes.string,
    onChange: PropTypes.func,
}

const DataSetSelectorBarDropDownContent = ({
    dataSets,
    dataSetsAreRestricted,
    dataSetId,
    dataSet,
    onChange,
}) => {
    const setOrgUnitId = useOrgUnitId()[1]

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
        <div>
            <FiltrableMenuItems
                options={dataSets || []}
                selected={dataSetId}
                onChange={onChange}
                searchText={i18n.t('Search for a data set')}
                dataTest="data-set-selector-menu"
            />
            {dataSetsAreRestricted && (
                <>
                    <MenuDivider />
                    <div className={styles.filterWarning}>
                        <div className={styles.filterWarningTextContainer}>
                            {i18n.t(
                                'Some data sets are being filtered by the chosen organisation unit'
                            )}
                        </div>
                        <Button
                            small
                            secondary
                            onClick={() => setOrgUnitId(undefined)}
                            dataTest={'data-set-selector-remove-orgUnit-button'}
                        >
                            {i18n.t('Show all data sets')}
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}

DataSetSelectorBarDropDownContent.propTypes = {
    dataSet: PropTypes.object,
    dataSetId: PropTypes.string,
    dataSets: PropTypes.array,
    dataSetsAreRestricted: PropTypes.bool,
    onChange: PropTypes.func,
}

export default function DataSetSelectorBarItem() {
    const { data: metadata } = useMetadata()
    const [dataSetOpen, setDataSetOpen] = useState(false)
    const [dataSetId, setDataSetId] = useDataSetId()
    const [orgUnitId] = useOrgUnitId()
    const allDataSets = selectors.getDataSets(metadata)
    const dataSets = orgUnitId
        ? selectors.getDataSetsByOrgUnitId(metadata, orgUnitId)
        : allDataSets
    const selectableDataSets = Object.values(dataSets)
        .map(({ id, displayName }) => ({
            label: displayName,
            value: id,
        }))
        .sort((left, right) => left.label.localeCompare(right.label))
    const dataSet = selectors.getDataSetById(metadata, dataSetId)

    // Select the first item if there's only one
    useEffect(() => {
        const isThereOnlyOneDataSet = Object.keys(dataSets)?.length === 1
        if (isThereOnlyOneDataSet) {
            const dataSetIDs = Object.keys(dataSets)
            setDataSetId(dataSetIDs[0])
        }
    }, [dataSets, setDataSetId])

    return (
        <div data-test="data-set-selector">
            <SelectorBarItem
                label={i18n.t('Data set')}
                value={dataSet?.displayName || undefined}
                open={dataSetOpen}
                setOpen={setDataSetOpen}
                noValueMessage={i18n.t('Choose a data set')}
                onClearSelectionClick={() => {
                    setDataSetId(undefined)
                }}
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
                        dataSetsAreRestricted={
                            Object.keys(allDataSets)?.length !==
                            Object.keys(dataSets)?.length
                        }
                    />
                </div>
            </SelectorBarItem>
        </div>
    )
}
