import { colors, NoticeBox, Table } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import { CategoryComboTable } from './category-combo-table.js'
import { MetadataContext } from './metadata-context.js'
import styles from './section.module.css'
import {
    getDataElementsByDataSetId,
    groupDataElementsByCatCombo,
} from './selectors.js'

export const DefaultForm = ({ dataSet, getDataValue, globalFilterText }) => {
    const { metadata } = useContext(MetadataContext)

    if (!metadata) {
        return 'Loading metadata'
    }

    const dataElements = getDataElementsByDataSetId(metadata, dataSet.id)

    const groupedDataElements = groupDataElementsByCatCombo(
        metadata,
        dataElements
    )

    console.log({ dataSet }, { groupedDataElements })

    return (
        <section className="wrapper">
            {groupedDataElements.length < 1 && (
                <NoticeBox
                    title="This data set has no assigned Data Elements"
                    warning
                >
                    There are no Data Elements in this data set. Adds some Data
                    Elements to use this data set.
                </NoticeBox>
            )}
            <Table className={styles.table} suppressZebraStriping>
                {groupedDataElements.map(({ categoryCombo, dataElements }) => (
                    <CategoryComboTable
                        key={categoryCombo.id}
                        categoryCombo={categoryCombo}
                        dataElements={dataElements}
                        getDataValue={getDataValue}
                        filterText={globalFilterText}
                    />
                ))}
            </Table>
            {/* Todo: verify styles with joe - 
            line height for title & description, lack of focus styles on input,
            inset box shadow in title?, grey300 on section description */}
            <style jsx>
                {`
                    header {
                        background-color: ${colors.grey800};
                        line-height: 20px;
                        padding: 4px 8px;
                    }
                    .title {
                        color: ${colors.grey050};
                        font-weight: 500;
                        font-size: 14px;
                    }
                    .description {
                        color: ${colors.grey300};
                        font-size: 13px;
                        margin-top: 2px;
                    }
                    .filter {
                        display: flex;
                        align-items: center;
                        background-color: #fff;
                        font-size: 13px;
                        line-height: 15px;
                        padding: 8px;
                        gap: 8px;
                    }
                    .filter input {
                        width: 100%;
                        background: none;
                        border: none;
                        color: ${colors.grey900};
                    }
                    .filter input::placeholder {
                        color: ${colors.grey600};
                    }
                    .filter input:focus {
                        outline: none;
                    }
                `}
            </style>
        </section>
    )
}
DefaultForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        id: PropTypes.string,
    }),
}
