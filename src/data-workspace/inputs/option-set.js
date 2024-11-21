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
import React, { useEffect, useState } from 'react'
import {
    useMetadata,
    selectors,
    useSetDataValueMutation,
} from '../../shared/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

const MULTI_TEXT_SEPARATOR = ','

const parse = ({ value, multi, sortByOptionsOrder }) => {
    if (multi) {
        return value?.sort(sortByOptionsOrder)?.join(MULTI_TEXT_SEPARATOR) ?? ''
    }
    return value ?? ''
}

const format = ({ value, multi }) => {
    if (multi) {
        return (value && value.split(MULTI_TEXT_SEPARATOR)) || []
    }
    return value ?? ''
}

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
    optionSetId,
    deId,
    cocId,
    onKeyDown,
    onFocus,
    onBlur,
    disabled,
    locked,
    multi,
    initialValue,
    setValueSynced,
}) => {
    const { data: metadata } = useMetadata()
    const optionSet = selectors.getOptionSetById(metadata, optionSetId)
    // filter out 'null' options
    const options = optionSet.options.filter((opt) => !!opt)
    const sortByOptionsOrder = createSortByOptionsOrder(options)

    const [value, setValue] = useState(initialValue)
    const [lastSyncedValue, setLastSyncedValue] = useState(initialValue)
    const [syncTouched, setSyncTouched] = useState(false)

    useEffect(() => {
        if (syncTouched) {
            setValueSynced(value === lastSyncedValue)
        }
    }, [value, lastSyncedValue, syncTouched])

    const { mutate } = useSetDataValueMutation({ deId, cocId })
    const syncData = (newValue) => {
        setSyncTouched(true)
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            { value: newValue },
            {
                onSuccess: () => {
                    setLastSyncedValue(newValue)
                },
            }
        )
    }

    const handleChange = (value) => {
        // For a select using onChange, don't need to check valid or dirty, respectively
        const parsedValue = parse({ value, multi, sortByOptionsOrder })
        setValue(parsedValue)
        if (parsedValue !== lastSyncedValue) {
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
        <div
            className={styles.selectFlexWrapper}
            onClick={onFocus}
            onBlur={onBlur}
        >
            <div className={styles.selectFlexItem}>
                <SelectComponent
                    dense
                    className={cx(styles.select, {
                        [styles.selectMulti]: multi,
                    })}
                    placeholder={placeholder}
                    //
                    selected={format({ value, multi })}
                    onChange={({ selected }) => {
                        handleChange(selected)
                    }}
                    onFocus={(...args) => {
                        onFocus?.(...args)
                    }}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
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
            {value && (
                <Button
                    small
                    secondary
                    className={cx(styles.whiteButton, styles.hideForPrint)}
                    onClick={() => {
                        handleChange('')
                        onBlur()
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
