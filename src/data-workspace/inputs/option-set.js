import i18n from '@dhis2/d2-i18n'
import { Button, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import { useMetadata } from '../../metadata/index.js'
import { getOptionSetById } from '../../metadata/selectors.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const OptionSet = ({
    name,
    syncData,
    lastSyncedValue,
    onKeyDown,
    dataElement,
}) => {
    const { input } = useField(name, { subscription: { value: true } })
    const { data: metadata } = useMetadata()

    const handleChange = (value) => {
        // For a select using onChange, don't need to check valid or dirty, respectively
        if (value !== lastSyncedValue) {
            syncData(value)
        }
    }

    const optionSet = getOptionSetById(metadata, dataElement.optionSet.id)
    // filter out 'null' options
    const options = optionSet.options.filter((opt) => !!opt)

    // todo: onBlur handler doesn't work, meaning the cell stays active.
    // may need to build from scratch
    return (
        <div onKeyDown={onKeyDown} className={styles.selectFlexWrapper}>
            <div className={styles.selectFlexItem}>
                <SingleSelect
                    dense
                    className={styles.select}
                    name={input.name}
                    placeholder={i18n.t('Choose an option')}
                    selected={input.value || ''}
                    onChange={({ selected }) => {
                        input.onChange(selected)
                        handleChange(selected)
                    }}
                    onFocus={() => {
                        // onBlur here helps buggy onFocus work correctly
                        input.onBlur()
                        input.onFocus()
                    }}
                    onBlur={() => input.onBlur()}
                >
                    {options.map(({ name }) => (
                        <SingleSelectOption
                            key={name}
                            label={name}
                            value={name}
                        />
                    ))}
                </SingleSelect>
            </div>
            {input.value && (
                <Button
                    small
                    secondary
                    className={styles.whiteButton}
                    {...input}
                    onClick={() => {
                        input.onChange('')
                        handleChange('')
                        input.onBlur()
                    }}
                >
                    {i18n.t('Clear')}
                </Button>
            )}
        </div>
    )
}
OptionSet.propTypes = {
    ...InputPropTypes,
    dataElement: PropTypes.shape({
        optionSet: PropTypes.shape({ id: PropTypes.string }),
        valueType: PropTypes.string,
    }).isRequired,
}
