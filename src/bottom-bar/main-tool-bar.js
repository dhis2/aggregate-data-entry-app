import i18n from '@dhis2/d2-i18n'
import { Button, IconErrorFilled16, IconInfo16, colors } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import cx from 'classnames'
import React from 'react'
import { MutationIndicator } from '../app/mutation-indicator/index.js'
import { validationResultsSidebarId } from '../data-workspace/constants.js'
import useRightHandPanelContext from '../right-hand-panel/use-right-hand-panel-context.js'
import {
    useDataValueSetQueryKey,
    useLockedContext,
    useEntryFormStore,
} from '../shared/index.js'
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

    const validateDisabled = activeMutations > 0

    const isComplete = true // @TODO(isComplete): implement me!
    const complete = () => console.log('@TODO(complete): implement me!')
    const incomplete = () => console.log('@TODO(incomplete): implement me!')
    const validate = () => {
        if (rightHandPanel.id === validationResultsSidebarId) {
            rightHandPanel.hide()
        } else {
            rightHandPanel.show(validationResultsSidebarId)
        }
    }
    const completedBy = 'Firstname Lastname' // @TODO(completedBy): implement me!

    return (
        <div className={styles.container}>
            <Button
                disabled={validateDisabled}
                className={styles.toolbarItem}
                onClick={validate}
            >
                {i18n.t('Run validation')}
            </Button>

            <Button
                disabled={locked}
                className={styles.toolbarItem}
                onClick={isComplete ? incomplete : complete}
            >
                {isComplete
                    ? i18n.t('Mark incomplete')
                    : i18n.t('Mark complete')}
            </Button>

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

            {isComplete && (
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
                            {i18n.t('Completed by')}
                        </span>
                        {completedBy}
                    </span>
                </span>
            )}
            <div className={styles.mutationIndicator}>
                <MutationIndicator />
            </div>
        </div>
    )
}
