import i18n from '@dhis2/d2-i18n'
import { NoticeBox, Table } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useMetadata, selectors } from '../metadata/index.js'
import { CategoryComboTableBody } from './category-combo-table-body/index.js'
import styles from './entry-form.module.css'
import { IndicatorsTableBody } from './indicators-table-body/indicators-table-body.js'

export function DefaultForm({ dataSet, globalFilterText }) {
    const { data } = useMetadata()

    const dataElements = selectors.getDataElementsByDataSetId(data, dataSet.id)
    const indicators = selectors.getIndicatorsByDataSetId(data, dataSet.id)
    const groupedDataElements = selectors.getGroupedDataElementsByCatCombo(
        data,
        dataElements
    )

    // calculate how many columns in each group
    const groupedTotalColumns = groupedDataElements.map((grp) =>
        (
            selectors
                .getCategoriesByCategoryComboId(data, grp.categoryCombo.id)
                ?.map((cat) => cat.categoryOptions.length) || [1]
        ).reduce((total, curr) => total * curr)
    )

    const nrColumnsInTable = Math.max(...groupedTotalColumns)

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
                    <CategoryComboTableBody
                        key={categoryCombo.id}
                        categoryCombo={categoryCombo}
                        dataElements={dataElements}
                        globalFilterText={globalFilterText}
                        maxColumnsInSection={nrColumnsInTable}
                    />
                ))}
                {indicators.length > 0 && (
                    <IndicatorsTableBody
                        indicators={indicators}
                        maxColumnsInSection={nrColumnsInTable}
                        globalFilterText={globalFilterText}
                    />
                )}
            </Table>
        </section>
    )
}

DefaultForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        id: PropTypes.string,
    }),
    globalFilterText: PropTypes.string,
}
