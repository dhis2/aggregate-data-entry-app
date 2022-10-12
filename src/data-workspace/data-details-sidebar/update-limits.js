import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useField, useForm } from 'react-final-form'
import { useUnsavedDataStore } from '../../shared/index.js'
import calculateAverage from './calculate-average.js'
import LimitsAverageValueInfo from './limits-average-value-info.js'
import LimitsDeleteButton from './limits-delete-button.js'
import LimitsFormWrapper from './limits-form-wrapper.js'
import limitInputLabelsByName from './limits-input-labels-by-name.js'
import LimitsInput from './limits-input.js'
import LimitsValidationErrorMessage from './limits-validation-error-message.js'
import styles from './limits.module.css'

function UpdateLimits({
    limits,
    categoryOptionComboId,
    dataElementId,
    onCancel,
    canAdd,
    canDelete,
    unsavedLimits,
    cellId,
}) {
    const setUnsavedLimits = useUnsavedDataStore(
        (state) => state.setUnsavedLimits
    )
    const form = useForm()
    const { submitting, submitFailed, errors } = form.getState()

    const minField = useField('min', {
        initialValue: unsavedLimits?.min || limits.min,
        format: (value) => (value !== undefined ? value.toString() : ''),
    })

    const maxField = useField('max', {
        initialValue: unsavedLimits?.max || limits.max,
        format: (value) => (value !== undefined ? value.toString() : ''),
    })

    const average = calculateAverage(minField.input.value, maxField.input.value)

    const onBlur = (input) => () => {
        setUnsavedLimits(cellId, {
            min: minField.input.value,
            max: maxField.input.value,
        })
        input?.onBlur?.()
    }
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.submit()
            }}
        >
            <div className={styles.limits}>
                <LimitsAverageValueInfo avg={average} />
                <div className={styles.limitsDisplayWrapper}>
                    <LimitsInput
                        {...minField.input}
                        onBlur={onBlur(minField.input)}
                        label={limitInputLabelsByName.min}
                        error={submitFailed && !!minField.meta.error}
                        disabled={!canAdd}
                    />

                    <div className={styles.spaceBetween}></div>

                    <LimitsInput
                        {...maxField.input}
                        onBlur={onBlur(maxField.input)}
                        label={limitInputLabelsByName.max}
                        error={submitFailed && !!maxField.meta.error}
                        disabled={!canAdd}
                    />
                </div>
            </div>

            {submitFailed && <LimitsValidationErrorMessage errors={errors} />}

            <ButtonStrip>
                {canAdd && (
                    <Button small primary type="submit" loading={submitting}>
                        {submitting
                            ? i18n.t('Saving...')
                            : i18n.t('Save limits')}
                    </Button>
                )}

                <Button
                    small
                    secondary
                    disabled={submitting}
                    onClick={onCancel}
                >
                    {i18n.t('Cancel')}
                </Button>

                {canDelete && (
                    <LimitsDeleteButton
                        dataElementId={dataElementId}
                        categoryOptionComboId={categoryOptionComboId}
                        disabled={
                            limits.min === undefined && limits.max === undefined
                        }
                    />
                )}
            </ButtonStrip>
        </form>
    )
}

UpdateLimits.propTypes = {
    categoryOptionComboId: PropTypes.string.isRequired,
    cellId: PropTypes.string.isRequired,
    dataElementId: PropTypes.string.isRequired,
    limits: PropTypes.shape({
        max: PropTypes.number,
        min: PropTypes.number,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    canAdd: PropTypes.bool,
    canDelete: PropTypes.bool,
    unsavedLimits: PropTypes.shape({
        max: PropTypes.string,
        min: PropTypes.string,
    }),
}

// In order to be able to use `useForm` and `useField`,
// the `UpdateLimits` component needs to be a child of a component
// that wraps it with react final form's Form component
export default function UpdateLimitsWrapper({
    limits,
    categoryOptionComboId,
    dataElementId,
    valueType,
    onDone,
    onCancel,
    canAdd,
    canDelete,
    unsavedLimits,
    cellId,
}) {
    return (
        <LimitsFormWrapper
            categoryOptionComboId={categoryOptionComboId}
            dataElementId={dataElementId}
            valueType={valueType}
            onDone={onDone}
        >
            <UpdateLimits
                limits={limits}
                categoryOptionComboId={categoryOptionComboId}
                dataElementId={dataElementId}
                onCancel={onCancel}
                canAdd={canAdd}
                canDelete={canDelete}
                unsavedLimits={unsavedLimits}
                cellId={cellId}
            />
        </LimitsFormWrapper>
    )
}

UpdateLimitsWrapper.propTypes = {
    categoryOptionComboId: PropTypes.string.isRequired,
    cellId: PropTypes.string.isRequired,
    dataElementId: PropTypes.string.isRequired,
    limits: PropTypes.shape({
        max: PropTypes.number,
        min: PropTypes.number,
    }).isRequired,
    valueType: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    canAdd: PropTypes.bool,
    canDelete: PropTypes.bool,
    unsavedLimits: PropTypes.shape({
        max: PropTypes.string,
        min: PropTypes.string,
    }),
}
