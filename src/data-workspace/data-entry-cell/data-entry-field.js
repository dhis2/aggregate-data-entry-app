import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { getFieldId } from '../get-field-id.js'
import styles from './data-entry-cell.module.css'
import { EntryFieldInput } from './entry-field-input.js'
import { InnerWrapper } from './inner-wrapper.js'
import { ValidationTooltip } from './validation-tooltip.js'

export const DataEntryField = React.memo(function DataEntryField({
    dataElement: de,
    categoryOptionCombo: coc,
    disabled,
    keptInFocus,
}) {
    // This field name results in this structure for the form data object:
    // { [deId]: { [cocId]: value } }
    const fieldname = getFieldId(de.id, coc.id)

    // todo: perhaps this could be refactored to use DV mutation state
    // See https://dhis2.atlassian.net/browse/TECH-1316
    const [syncStatus, setSyncStatus] = useState({
        syncing: false,
        synced: false,
    })

    return (
        <td className={styles.dataEntryCell}>
            <ValidationTooltip fieldname={fieldname}>
                <InnerWrapper
                    fieldname={fieldname}
                    deId={de.id}
                    cocId={coc.id}
                    syncStatus={syncStatus}
                    disabled={disabled}
                    keptInFocus={keptInFocus}
                >
                    <EntryFieldInput
                        fieldname={fieldname}
                        dataElement={de}
                        categoryOptionCombo={coc}
                        setSyncStatus={setSyncStatus}
                        disabled={disabled}
                    />
                </InnerWrapper>
            </ValidationTooltip>
        </td>
    )
})

DataEntryField.propTypes = {
    categoryOptionCombo: PropTypes.shape({ id: PropTypes.string.isRequired })
        .isRequired,
    dataElement: PropTypes.shape({
        id: PropTypes.string.isRequired,
        valueType: PropTypes.string,
    }).isRequired,
    disabled: PropTypes.bool,
    keptInFocus: PropTypes.bool,
}
