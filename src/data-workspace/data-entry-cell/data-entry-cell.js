import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './data-entry-cell.module.css'
import { EntryFieldInput } from './entry-field-input.js'
import { InnerWrapper } from './inner-wrapper.js'
import { ValidationTooltip } from './validation-tooltip.js'

export const DataEntryCell = React.memo(function DataEntryCell({
    dataElement: de,
    categoryOptionCombo: coc,
}) {
    // This field name results in this structure for the form data object:
    // { [deId]: { [cocId]: value } }
    const fieldname = `${de.id}.${coc.id}`
    const [syncStatus, setSyncStatus] = useState({ syncing: false, synced: false })

    // todo: get data details (via getDataValue?)
    // todo: implement read-only cells

    return (
        <td className={styles.dataEntryCell}>
            <ValidationTooltip fieldname={fieldname}>
                <InnerWrapper fieldname={fieldname} syncStatus={syncStatus}>
                    <EntryFieldInput
                        fieldname={fieldname}
                        dataElement={de}
                        setSyncStatus={setSyncStatus}
                    />
                </InnerWrapper>
            </ValidationTooltip>
        </td>
    )
})
DataEntryCell.propTypes = {
    categoryOptionCombo: PropTypes.shape({ id: PropTypes.string.isRequired })
        .isRequired,
    dataElement: PropTypes.shape({
        id: PropTypes.string.isRequired,
        valueType: PropTypes.string,
    }).isRequired,
}
