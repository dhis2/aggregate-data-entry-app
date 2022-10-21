import i18n from '@dhis2/d2-i18n'
import { IconErrorFilled16, IconWarningFilled16, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {
    useEntryFormStore,
    useSyncErrorsStore,
    useContextSelectionId,
} from '../shared/index.js'
import styles from './main-tool-bar.module.css'

const invalidMessage = (numberOfErrors) =>
    numberOfErrors === 1
        ? i18n.t('1 invalid value not saved')
        : i18n.t('{{numberOfErrors}} invalid values not saved', {
              numberOfErrors,
          })

const failedToSaveMessage = (numberOfErrors) =>
    numberOfErrors === 1
        ? i18n.t('1 value failed to save')
        : i18n.t('{{numberOfErrors}} values failed to save', {
              numberOfErrors,
          })

function ErrorSummaryButton({ numberOfErrors, invalid }) {
    if (numberOfErrors < 1) {
        return null
    }

    const buttonStyle = invalid
        ? styles.goToInvalidValue
        : styles.goToErrorValue

    const icon = invalid ? (
        <IconErrorFilled16 color={colors.red700} />
    ) : (
        <IconWarningFilled16 color={colors.yellow800} />
    )

    const message = invalid
        ? invalidMessage(numberOfErrors)
        : failedToSaveMessage(numberOfErrors)

    return (
        <button className={cx(buttonStyle, styles.toolbarItem)}>
            <span className={cx(styles.icon, styles.goToInvalidValueIcon)}>
                {icon}
            </span>
            <span className={styles.goToInvalidValueLabel}>{message}</span>
        </button>
    )
}

ErrorSummaryButton.propTypes = {
    invalid: PropTypes.bool,
    numberOfErrors: PropTypes.number,
}

export default function ErrorSummary() {
    const contextSelectionId = useContextSelectionId()
    const numberOfEntryFormErrors = useEntryFormStore((state) =>
        state.getNumberOfErrors()
    )
    const numberOfSyncingErrors = useSyncErrorsStore((state) =>
        state.getNumberOfErrors(state.getErrorsForSelection(contextSelectionId))
    )

    return (
        <>
            <ErrorSummaryButton
                invalid
                numberOfErrors={numberOfEntryFormErrors}
            />
            <ErrorSummaryButton numberOfErrors={numberOfSyncingErrors} />
        </>
    )
}
