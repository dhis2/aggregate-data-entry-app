import { IconInfo16, colors } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import i18n from '../locales/index.js'
import { useLockedContext } from '../shared/index.js'
import styles from './main-tool-bar.module.css'

export default function FormExpiryInfo() {
    const {
        locked,
        lockStatus: { lockDate },
    } = useLockedContext()

    return (
        <>
            {!locked && lockDate && (
                <span
                    className={cx(styles.completionSummary, styles.toolbarItem)}
                >
                    <span className={cx(styles.icon)}>
                        <IconInfo16 color={colors.grey700} />
                    </span>

                    <span>
                        {i18n.t('This form closes at {{-dateTime}}', {
                            dateTime: lockDate.toLocaleString(),
                        })}
                    </span>
                </span>
            )}
        </>
    )
}
