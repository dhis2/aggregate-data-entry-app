import i18n from '@dhis2/d2-i18n'
import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

export default function SearchInput({ onChange }) {
    const [value, setValue] = useState('')

    return (
        <InputField
            dense
            value={value}
            name="context-selection-org-unit-search"
            placeholder={i18n.t('Search org units')}
            onChange={({ value: nextValue }) => {
                setValue(nextValue)
                onChange(nextValue)
            }}
            helpText={i18n.t('Only loaded org units will be searched')}
        />
    )
}

SearchInput.propTypes = {
    onChange: PropTypes.func.isRequired,
}
