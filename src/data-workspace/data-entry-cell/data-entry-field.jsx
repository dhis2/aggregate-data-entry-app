import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    useLockedContext,
    useHighlightedFieldStore,
} from '../../shared/index.js'
import { getFieldId } from '../get-field-id.jsx'
import { EntryFieldInput } from './entry-field-input.jsx'
import { InnerWrapper } from './inner-wrapper.jsx'

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

    const { locked } = useLockedContext()

    const [active, setActive] = useState(false)
    const [valueSynced, setValueSynced] = useState(false)

    return (
        <InnerWrapper
            fieldname={fieldname}
            deId={de.id}
            cocId={coc.id}
            disabled={disabled}
            locked={locked}
            highlighted={highlighted}
            valueSynced={valueSynced}
            active={active}
        >
            <EntryFieldInput
                fieldname={fieldname}
                dataElement={de}
                categoryOptionCombo={coc}
                disabled={disabled}
                locked={locked}
                highlighted={highlighted}
                setActive={setActive}
                setValueSynced={setValueSynced}
            />
        </InnerWrapper>
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
