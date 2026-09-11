import i18n from '@dhis2/d2-i18n'
import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import useDebounce from './use-debounce.js'

export default function DebouncedSearchInput({
    onChange,
    onInputChange,
    initialValue,
}) {
    const [input, setInput] = useState({
        value: initialValue,
        composing: false,
    })
    const debouncedInput = useDebounce(input, 200)

    useEffect(() => {
        if (input === debouncedInput && !input.composing) {
            onChange(input.value.trim())
        }
    }, [onChange, input, debouncedInput])

    return (
        <div
            onCompositionStart={() => {
                setInput((current) => ({ ...current, composing: true }))
                onInputChange('')
            }}
            onCompositionEnd={(event) => {
                const nextValue = event.target.value
                setInput({ value: nextValue, composing: false })
                onInputChange(nextValue)
            }}
        >
            <InputField
                dense
                initialFocus
                value={input.value}
                name="context-selection-org-unit-search"
                placeholder={i18n.t('Search org units')}
                helpText={i18n.t('Enter at least 3 characters to search')}
                onChange={({ value: nextValue }) => {
                    setInput((current) => ({ ...current, value: nextValue }))
                    onInputChange(input.composing ? '' : nextValue)
                }}
            />
        </div>
    )
}

DebouncedSearchInput.propTypes = {
    initialValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
}
