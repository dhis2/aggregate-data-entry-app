import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    useLockedContext,
    useHighlightedFieldStore,
} from '../../shared/index.js'
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
    const highlighted = useHighlightedFieldStore((state) =>
        state.isFieldHighlighted({
            dataElementId: de.id,
            categoryOptionComboId: coc.id,
        })
    )
    // todo: perhaps this could be refactored to use DV mutation state
    // See https://dhis2.atlassian.net/browse/TECH-1316
    const [syncStatus, setSyncStatus] = useState({
        syncing: false,
        synced: false,
    })
    const { locked } = useLockedContext()

    return (
        <ValidationTooltip fieldname={fieldname}>
            <InnerWrapper
                fieldname={fieldname}
                deId={de.id}
                cocId={coc.id}
                syncStatus={syncStatus}
                disabled={disabled}
                locked={locked}
                highlighted={highlighted}
            >
                <EntryFieldInput
                    fieldname={fieldname}
                    dataElement={de}
                    categoryOptionCombo={coc}
                    setSyncStatus={setSyncStatus}
                    disabled={disabled}
                    locked={locked}
                    highlighted={highlighted}
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
