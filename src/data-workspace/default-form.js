import i18n from '@dhis2/d2-i18n'
import { NoticeBox, Table } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { CategoryComboTable } from './category-combo-table.js'
import { useMetadata } from './metadata-context.js'
import styles from './section.module.css'
import {
    getDataElementsByDataSetId,
    groupDataElementsByCatCombo,
} from './selectors.js'

export const DefaultForm = ({ dataSet, getDataValue, globalFilterText }) => {
    const { metadata } = useMetadata()

    const groupedDataElements = useMemo(() => {
        const dataElements = getDataElementsByDataSetId(metadata, dataSet.id)

        return groupDataElementsByCatCombo(metadata, dataElements)
    }, [metadata, dataSet])

    return (
        <section className="wrapper">
            {groupedDataElements.length < 1 && (
                <NoticeBox
                    title={i18n.t(
                        'This data set has no assigned Data Elements'
                    )}
                    warning
                >
                    {i18n.t(
                        'There are no Data Elements in this data set. Adds some Data Elements to use this data set.'
                    )}
                </NoticeBox>
            )}
            <Table className={styles.table} suppressZebraStriping>
                {groupedDataElements.map(({ categoryCombo, dataElements }) => (
                    <CategoryComboTable
                        key={categoryCombo.id}
                        categoryCombo={categoryCombo}
                        dataElements={dataElements}
                        getDataValue={getDataValue}
                        globalFilterText={globalFilterText}
                    />
                ))}
            </Table>
        </section>
    )
}
DefaultForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        id: PropTypes.string,
    }),
    getDataValue: PropTypes.func,
    globalFilterText: PropTypes.string,
}
