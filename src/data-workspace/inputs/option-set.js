import i18n from '@dhis2/d2-i18n'
import { Button, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useMetadata, selectors } from '../../shared/index.js'
import { useSetDataValueMutation } from '../use-data-value-mutation/_data-value-mutations.js'
// import { useSetDataValueMutation } from '../use-data-value-mutation/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const OptionSet = ({
    fieldname,
    optionSetId,
    dataValueParams,
    setSyncStatus,
    onKeyDown,
    onFocus,
    disabled,
}) => {
    const { input } = useField(fieldname, { subscription: { value: true } })
    const { data: metadata } = useMetadata()

    const [lastSyncedValue, setLastSyncedValue] = useState()
    const { mutate } = useSetDataValueMutation({
        deId: dataValueParams.de,
        cocId: dataValueParams.co,
    })
    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { value: value || '' },
            {
                onSuccess: () => {
                    setLastSyncedValue(value)
                    setSyncStatus({ syncing: false, synced: true })
                },
            }
        )
    }

    const handleChange = (value) => {
        // For a select using onChange, don't need to check valid or dirty, respectively
        if (value !== lastSyncedValue) {
            syncData(value)
        }
    }

    const optionSet = selectors.getOptionSetById(metadata, optionSetId)
    // filter out 'null' options
    const options = optionSet.options.filter((opt) => !!opt)

    // todo: onBlur handler doesn't work, meaning the cell stays active.
    // may need to build from scratch
    return (
        <div className={styles.selectFlexWrapper}>
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
                    onFocus={(...args) => {
                        // onBlur here helps buggy onFocus work correctly
                        input.onBlur()
                        input.onFocus()
                        onFocus?.(...args)
                    }}
                    onKeyDown={onKeyDown}
                    onBlur={() => input.onBlur()}
                    disabled={disabled}
                >
                    {options.map(({ id, code, displayName }) => (
                        <SingleSelectOption
                            key={id}
                            label={displayName}
                            value={code}
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
                    disabled={disabled}
                >
                    {i18n.t('Clear')}
                </Button>
            )}
        </div>
    )
}
OptionSet.propTypes = {
    ...InputPropTypes,
    optionSetId: PropTypes.string,
}
