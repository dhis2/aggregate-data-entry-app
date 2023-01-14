import i18n from '@dhis2/d2-i18n'
import {
    Button,
    SingleSelect,
    MultiSelect,
    MultiSelectOption,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import {
    useMetadata,
    selectors,
    useSetDataValueMutation,
} from '../../shared/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const OptionSet = ({
    fieldname,
    form,
    optionSetId,
    deId,
    cocId,
    onKeyDown,
    onFocus,
    disabled,
    locked,
    multi,
}) => {
    const parse = (value) => {
        console.log('parse', value)
        if (multi) {
            return (value && value.join(',')) || ''
        } else {
            // Empty values need an empty string
            return value || ''
        }
    }

    const {
        input,
        meta: { data },
    } = useField(fieldname, {
        subscription: { value: true, data: true },
        format:
            // format to an array when multi, since component needs an array
            multi
                ? (value) => {
                      console.log({ value })
                      const formatted = (value && value.split(',')) || []
                      return formatted
                  }
                : undefined,
        // parse from array to a string, since the api expects a string
        parse: multi ? parse : undefined,
    })

    const { data: metadata } = useMetadata()

    const { mutate } = useSetDataValueMutation({ deId, cocId })
    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            { value },
            {
                onSuccess: () => {
                    form.mutators.setFieldData(fieldname, {
                        lastSyncedValue: value,
                    })
                },
            }
        )
    }

    const handleChange = (value) => {
        // For a select using onChange, don't need to check valid or dirty, respectively
        if (value !== data.lastSyncedValue) {
            // need to parse here as well, since it's not parsed before onChange is called
            const parsedValue = parse(value)
            syncData(parsedValue)
        }
    }

    const optionSet = selectors.getOptionSetById(metadata, optionSetId)
    // filter out 'null' options
    const options = optionSet.options.filter((opt) => !!opt)

    const SelectComponent = multi ? MultiSelect : SingleSelect
    const SelectOptionComponent = multi ? MultiSelectOption : SingleSelectOption
    const placeholder = multi
        ? i18n.t('Choose option(s)')
        : i18n.t('Choose an option')
    // if(multi) {
    //     return <MultiSelectOptionSet options={options} input={input} disabled={disabled || locked} />
    // }
    // todo: onBlur handler doesn't work, meaning the cell stays active.
    return (
        <div className={styles.selectFlexWrapper} onClick={onFocus}>
            <div className={styles.selectFlexItem}>
                <SelectComponent
                    dense
                    className={styles.select}
                    name={input.name}
                    placeholder={placeholder}
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
                    disabled={disabled || locked}
                    inputMaxHeight={'24px'}
                >
                    {options.map(({ id, code, displayName }) => (
                        <SelectOptionComponent
                            key={id}
                            label={displayName}
                            value={code}
                        />
                    ))}
                </SelectComponent>
            </div>
            {input.value && (
                <Button
                    small
                    secondary
                    className={styles.whiteButton}
                    onClick={() => {
                        input.onChange('')
                        handleChange('')
                        input.onBlur()
                    }}
                    disabled={disabled || locked}
                >
                    {i18n.t('Clear')}
                </Button>
            )}
        </div>
    )
}
OptionSet.propTypes = {
    ...InputPropTypes,
    multi: PropTypes.bool,
    optionSetId: PropTypes.string,
}
