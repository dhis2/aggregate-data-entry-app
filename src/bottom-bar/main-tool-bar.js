import i18n from '@dhis2/d2-i18n'
import { Button, IconErrorFilled16, IconInfo16, colors } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import styles from './main-tool-bar.module.css'

export default function MainToolBar() {
    const canValidate = false // @TODO(canValidate): implement me!
    const isComplete = true // @TODO(isComplete): implement me!
    const complete = () => console.log('@TODO(complete): implement me!')
    const incomplete = () => console.log('@TODO(incomplete): implement me!')
    const validate = () => console.log('@TODO(validate): implement me!')
    const completedBy = 'Firstname Lastname' // @TODO(completedBy): implement me!

    return (
        <div className={styles.container}>
            <Button
                disabled={!canValidate}
                className={styles.toolbarItem}
                onClick={validate}
            >
                {i18n.t('Run validation')}
            </Button>

            <Button
                className={styles.toolbarItem}
                onClick={isComplete ? incomplete : complete}
            >
                {isComplete
                    ? i18n.t('Mark incomplete')
                    : i18n.t('Mark complete')}
            </Button>

            <button className={cx(styles.goToInvalidValue, styles.toolbarItem)}>
                <span className={cx(styles.icon, styles.goToInvalidValueIcon)}>
                    <IconErrorFilled16 color={colors.red700} />
                </span>

                <span className={styles.goToInvalidValueLabel}>
                    {i18n.t('3 invalid values not saved')}
                </span>
            </button>

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
        </div>
    )
}