import PropTypes from 'prop-types'
import React from 'react'
import { useLockedContext } from '../../shared/index.js'
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

    const { locked } = useLockedContext()

    return (
        <ValidationTooltip fieldname={fieldname}>
            <InnerWrapper
                fieldname={fieldname}
                deId={de.id}
                cocId={coc.id}
                disabled={disabled}
                locked={locked}
            >
                <EntryFieldInput
                    fieldname={fieldname}
                    dataElement={de}
                    categoryOptionCombo={coc}
                    disabled={disabled}
                    locked={locked}
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
