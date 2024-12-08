import i18n from '@dhis2/d2-i18n'
import { Button, Radio } from '@dhis2/ui'
import cx from 'classnames'
import React, { useEffect, useState } from 'react'
import { useSetDataValueMutation } from '../../shared/index.js'
import styles from './inputs.module.css'
import { InputPropTypes, convertBooleanValue } from './utils.js'

export const BooleanRadios = ({
    deId,
    cocId,
    disabled,
    locked,
    onKeyDown,
    onFocus,
    onBlur,
    setValueSynced,
    initialValue,
}) => {
    const [value, setValue] = useState(() => convertBooleanValue(initialValue))
    const [lastSyncedValue, setLastSyncedValue] = useState(() =>
        convertBooleanValue(initialValue)
    )
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
            // Empty values need an empty string
            { value: newValue || '' },
            {
                onSuccess: () => {
                    setLastSyncedValue(newValue)
                },
            }
        )
    }

    const handleChange = (newValue) => {
        setValue(newValue)
        // If this value has changed, sync it to server if valid
        // we skip validation as the values are limited to 'false', 'true', ''
        if (newValue !== lastSyncedValue) {
            syncData(newValue)
        }
    }

    return (
        <div
            className={styles.radioFlexWrapper}
            onClick={onFocus}
            onBlur={onBlur}
        >
            <Radio
                dense
                label={i18n.t('Yes')}
                value={'true'}
                checked={value === 'true'}
                onChange={() => {
                    handleChange('true')
                }}
                onKeyDown={onKeyDown}
                disabled={disabled || locked}
            />
            <Radio
                dense
                label={i18n.t('No')}
                value={'false'}
                checked={value === 'false'}
                onChange={() => {
                    handleChange('false')
                }}
                onKeyDown={onKeyDown}
                disabled={disabled || locked}
            />
            <Button
                small
                secondary
                className={cx(styles.whiteButton, {
                    // If no value to clear, hide but still reserve space
                    [styles.hidden]: value === '',
                })}
                onClick={() => {
                    handleChange('')
                    onFocus()
                }}
                onKeyDown={onKeyDown}
                disabled={disabled || locked}
            >
                {i18n.t('Clear')}
            </Button>
        </div>
    )
}

BooleanRadios.propTypes = InputPropTypes
