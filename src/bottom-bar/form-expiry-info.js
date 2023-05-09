import { IconInfo16, colors, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import moment from 'moment'
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
                <Tooltip
                    content={i18n.t(
                        'This form closes and will be locked at {{-dateTime}}',
                        { dateTime: lockDate.toLocaleString() }
                    )}
                >
                    <span
                        className={cx(
                            styles.completionSummary,
                            styles.toolbarItem
                        )}
                    >
                        <span className={cx(styles.icon)}>
                            <IconInfo16 color={colors.grey700} />
                        </span>

                        <span>
                            {i18n.t('Closes {{-relativeTime}}', {
                                relativeTime: moment(lockDate).fromNow(),
                            })}
                        </span>
                    </span>
                </Tooltip>
            )}
        </>
    )
}
