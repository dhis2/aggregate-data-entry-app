import i18n from '@dhis2/d2-i18n'
import { Button, IconErrorFilled16, IconInfo16, colors } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import cx from 'classnames'
import React from 'react'
import { MutationIndicator } from '../app/mutation-indicator/index.js'
import useRightHandPanelContext from '../right-hand-panel/use-right-hand-panel-context.js'
import {
    useDataValueSet,
    useDataValueSetQueryKey,
    useLockedContext,
    useEntryFormStore,
    validationResultsSidebarId,
} from '../shared/index.js'
import CompleteButton from './complete-button.js'
import styles from './main-tool-bar.module.css'

export default function MainToolBar() {
    const rightHandPanel = useRightHandPanelContext()
    const queryKey = useDataValueSetQueryKey()
    const { locked } = useLockedContext()
    const activeMutations = useIsMutating({
        mutationKey: queryKey,
    })
    const numberOfErrors = useEntryFormStore((state) =>
        state.getNumberOfErrors()
    )
    const { data } = useDataValueSet()

    const validateDisabled = activeMutations > 0

    const validate = () => {
        if (rightHandPanel.id === validationResultsSidebarId) {
            rightHandPanel.hide()
        } else {
            rightHandPanel.show(validationResultsSidebarId)
        }
    }

    return (
        <div className={styles.container}>
            <Button
                disabled={validateDisabled}
                className={styles.toolbarItem}
                onClick={validate}
            >
                {i18n.t('Run validation')}
            </Button>

            <div className={styles.toolbarItem}>
                <CompleteButton disabled={locked} />
            </div>

            {numberOfErrors > 0 && (
                <button
                    className={cx(styles.goToInvalidValue, styles.toolbarItem)}
                >
                    <span
                        className={cx(styles.icon, styles.goToInvalidValueIcon)}
                    >
                        <IconErrorFilled16 color={colors.red700} />
                    </span>
                    <span className={styles.goToInvalidValueLabel}>
                        {numberOfErrors === 1
                            ? i18n.t('1 invalid value not saved')
                            : i18n.t(
                                  '{{numberOfErrors}} invalid values not saved',
                                  { numberOfErrors }
                              )}
                    </span>
                </button>
            )}

            {data?.completeStatus.lastUpdatedBy && (
                <span
                    className={cx(styles.completionSummary, styles.toolbarItem)}
                >
                    <span
                        className={cx(styles.icon, styles.goToInvalidValueIcon)}
                    >
                        <IconInfo16 color={colors.grey700} />
                    </span>

                    <span>
                        <span className={styles.completedByLabel}>
                            {data.completeStatus.complete
                                ? i18n.t('Last completed by')
                                : i18n.t('Last incompleted by')}
                        </span>
                        {data?.completeStatus.lastUpdatedBy}
                    </span>
                </span>
            )}
            <div className={styles.mutationIndicator}>
                <MutationIndicator />
            </div>
        </div>
    )
}
