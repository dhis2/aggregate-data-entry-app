import i18n from '@dhis2/d2-i18n'
import { Button, IconInfo16, Tooltip, colors } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import useRightHandPanelContext from '../right-hand-panel/use-right-hand-panel-context.js'
import {
    useConnectionStatus,
    useDataValueSet,
    useDataValueSetQueryKey,
    useLockedContext,
    validationResultsSidebarId,
    useValidationStore,
} from '../shared/index.js'
import CompleteButton from './complete-button.jsx'
import ErrorSummary from './error-summary.jsx'
import FormExpiryInfo from './form-expiry-info.jsx'
import styles from './main-tool-bar.module.css'

function ValidationButtonTooltip({ validateDisabled, offline, children }) {
    if (!validateDisabled) {
        return children
    }

    const tooltipContent = offline
        ? i18n.t('Validation is not available offline')
        : i18n.t('Validation is not available while changes are pending')

    return (
        <div className={styles.tooltipToolbarItem}>
            <Tooltip content={tooltipContent}>{children}</Tooltip>
        </div>
    )
}

ValidationButtonTooltip.propTypes = {
    children: PropTypes.any.isRequired,
    offline: PropTypes.bool,
    validateDisabled: PropTypes.bool,
}

export default function MainToolBar() {
    const rightHandPanel = useRightHandPanelContext()
    const queryKey = useDataValueSetQueryKey()
    const { locked } = useLockedContext()
    const activeMutations = useIsMutating({
        mutationKey: queryKey,
    })
    const { offline } = useConnectionStatus()
    const validateDisabled = offline || activeMutations > 0
    const { data } = useDataValueSet()

    const setValidationToRefresh = useValidationStore(
        (store) => store.setValidationToRefresh
    )

    const validate = () => {
        if (rightHandPanel.id === validationResultsSidebarId) {
            setValidationToRefresh(true)
        } else {
            rightHandPanel.show(validationResultsSidebarId)
        }
    }

    return (
        <div className={styles.container}>
            <ValidationButtonTooltip
                validateDisabled={validateDisabled}
                offline={offline}
            >
                <Button
                    small
                    disabled={validateDisabled}
                    className={styles.toolbarItem}
                    onClick={validate}
                >
                    {i18n.t('Run validation')}
                </Button>
            </ValidationButtonTooltip>
            <div className={styles.toolbarItem}>
                <CompleteButton disabled={locked} />
            </div>
            <ErrorSummary />
            <FormExpiryInfo />
            {data?.completeStatus?.lastUpdatedBy && (
                <span
                    className={cx(styles.completionSummary, styles.toolbarItem)}
                >
                    <span className={cx(styles.icon)}>
                        <IconInfo16 color={colors.grey700} />
                    </span>

                    <span>
                        {data.completeStatus.complete
                            ? i18n.t('Last completed by {{-username}}', {
                                  username: data.completeStatus.lastUpdatedBy,
                              })
                            : i18n.t('Last incompleted by {{-username}}', {
                                  username: data.completeStatus.lastUpdatedBy,
                              })}
                    </span>
                </span>
            )}
        </div>
    )
}
