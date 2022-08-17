import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { getFieldId } from '../get-field-id.js'
import { EntryFieldInput } from './entry-field-input.js'
import { InnerWrapper } from './inner-wrapper.js'
import { ValidationTooltip } from './validation-tooltip.js'

export const DataEntryField = React.memo(function DataEntryField({
    dataElement: de,
    categoryOptionCombo: coc,
    disabled,
}) {
    // This field name results in this structure for the form data object:
    // { [deId]: { [cocId]: value } }
    const fieldname = getFieldId(de.id, coc.id)

    // todo: perhaps this could be refactored to use DV mutation state
    const [syncStatus, setSyncStatus] = useState({
        syncing: false,
        synced: false,
    })

    return (
        <ValidationTooltip fieldname={fieldname}>
            <InnerWrapper
                fieldname={fieldname}
                syncStatus={syncStatus}
                disabled={disabled}
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
}
