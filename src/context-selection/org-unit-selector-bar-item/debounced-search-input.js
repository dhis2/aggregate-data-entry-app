import i18n from '@dhis2/d2-i18n'
import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import useDebounce from './use-debounce.js'

export default function DebouncedSearchInput({ onChange, initialValue }) {
    const [value, setValue] = useState(initialValue)
    const debouncedValue = useDebounce(value, 200)

    useEffect(() => {
        onChange(debouncedValue)
    }, [onChange, debouncedValue])

    return (
        <InputField
            dense
            value={value}
            name="context-selection-org-unit-search"
            placeholder={i18n.t('Search org units')}
            onChange={({ value: nextValue }) => setValue(nextValue)}
        />
    )
}

DebouncedSearchInput.propTypes = {
    initialValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}
