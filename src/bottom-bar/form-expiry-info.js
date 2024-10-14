import { useConfig } from '@dhis2/app-runtime'
import { IconInfo16, colors, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import i18n from '../locales/index.js'
import { useLockedContext, getRelativeTime } from '../shared/index.js'
import styles from './main-tool-bar.module.css'

export default function FormExpiryInfo() {
    const {
        locked,
        lockStatus: { lockDate },
    } = useLockedContext()

    const { systemInfo = {} } = useConfig()
    const { serverTimeZoneId: timezone = 'Etc/UTC' } = systemInfo
    // the lock date is returned in ISO calendar
    const relativeTime = getRelativeTime({
        startDate: lockDate,
        calendar: 'gregory',
        timezone,
    })
    const dateTime = `${lockDate} (${timezone})`

    return (
        <>
            {!locked && lockDate && (
                <Tooltip
                    content={i18n.t(
                        'This form closes and will be locked at {{-dateTime}}',
                        { dateTime }
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
                                relativeTime,
                            })}
                        </span>
                    </span>
                </Tooltip>
            )}
        </>
    )
}
