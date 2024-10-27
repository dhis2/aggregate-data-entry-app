import i18n from '@dhis2/d2-i18n'
import {
    Button,
    SingleSelect,
    MultiSelect,
    MultiSelectOption,
    SingleSelectOption,
} from '@dhis2/ui'
import cx from 'classnames'
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

const MULTI_TEXT_SEPERATOR = ','

// This is used to preserve the order of the optionSet for the selected options
const createSortByOptionsOrder = (options) => (a, b) => {
    let aIndex, bIndex
    for (let i = 0; i < options.length; i++) {
        if (aIndex !== undefined && bIndex !== undefined) {
            break
        }
        const option = options[i]
        if (option.code === a) {
            aIndex = i
        }
        if (option.code === b) {
            bIndex = i
        }
    }
    return aIndex - bIndex
}

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
    const { data: metadata } = useMetadata()
    const optionSet = selectors.getOptionSetById(metadata, optionSetId)
    // filter out 'null' options
    const options = optionSet.options.filter((opt) => !!opt)
    const sortByOptionsOrder = createSortByOptionsOrder(options)

    const parse = (value) =>
        multi
            ? (value &&
                  value.sort(sortByOptionsOrder).join(MULTI_TEXT_SEPERATOR)) ??
              ''
            : value ?? '' // empty value needs an empty string

    const {
        input,
        meta: { data },
    } = useField(fieldname, {
        subscription: { value: true, data: true },
        // format applies to the input.value
        format:
            // format to an array when multi, since component expects an array
            multi
                ? (value) => {
                      const formatted =
                          (value && value.split(MULTI_TEXT_SEPERATOR)) || []
                      return formatted
                  }
                : undefined,
        // parse happens after onChange, and applies to the value saved in the internal form state
        // parse from array to a string, since the api expects a string
        parse,
    })

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
            // normally you would use the formState, where parse is called by finalForm,
            // but since we are syncing after every change/blur we need to do this "twice".
            const parsedValue = parse(value)
            syncData(parsedValue)
        }
    }

    const SelectComponent = multi ? MultiSelect : SingleSelect
    const SelectOptionComponent = multi ? MultiSelectOption : SingleSelectOption
    const placeholder = multi
        ? i18n.t('Choose option(s)')
        : i18n.t('Choose an option')

    // todo: onBlur handler doesn't work, meaning the cell stays active.
    return (
        <div className={styles.selectFlexWrapper} onClick={onFocus}>
            <div className={styles.selectFlexItem}>
                <SelectComponent
                    dense
                    className={cx(styles.select, {
                        [styles.selectMulti]: multi,
                    })}
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
                    {...input}
                    small
                    secondary
                    className={cx(styles.whiteButton, styles.hideForPrint)}
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
