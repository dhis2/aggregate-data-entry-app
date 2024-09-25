import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Tooltip, IconFlag16, colors } from '@dhis2/ui'
import React from 'react'
import { getRelativeTime } from '../../shared/index.js'
import FollowUpButton from './basic-information-follow-up-button.js'
import styles from './basic-information.module.css'
import ItemPropType from './item-prop-type.js'

const BasicInformation = ({ item }) => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory', serverTimeZoneId: timezone = 'Etc/UTC' } =
        systemInfo

    const lastUpdatedString = item.lastUpdated
        ? `${item.lastUpdated} (${timezone})`
        : null

    // if item.lastUpdated is "undefined", getRelativeTime returns null
    // and this will not be displayed
    // may not be translated: https://dhis2.atlassian.net/browse/TECH-1461
    const timeAgo = getRelativeTime({
        startDate: item.lastUpdated,
        calendar,
        timezone,
    })

    return (
        <div className={styles.unit}>
            <h1 className={styles.title}>
                {item.displayFormName}
                {item.categoryOptionComboName &&
                    ` | ${item.categoryOptionComboName}`}
            </h1>

            <ul className={styles.elements}>
                {item.description && (
                    <li>
                        {i18n.t('Description: {{- description}}', {
                            description: item.description,
                            nsSeparator: '-:-',
                        })}
                    </li>
                )}
                {item.code && (
                    <li>
                        {i18n.t('Code: {{code}}', {
                            code: item.code,
                            nsSeparator: '-:-',
                        })}
                    </li>
                )}
                <li>
                    {i18n.t('Data element ID: {{id}}', {
                        id: item.dataElement,
                        nsSeparator: '-:-',
                    })}
                </li>
                <li>
                    {i18n.t('Category option combo ID: {{id}}', {
                        id: item.categoryOptionCombo,
                        nsSeparator: '-:-',
                    })}
                </li>
                <li>
                    {item.lastUpdated && (
                        <Tooltip content={lastUpdatedString}>
                            {/* timeAgo will be null if non-Gregory calendar. TO DO: update */}
                            {i18n.t(
                                'Last updated {{- timeAgo}} by {{- name}}',
                                {
                                    timeAgo: timeAgo
                                        ? timeAgo
                                        : lastUpdatedString,
                                    name: item.storedBy,
                                }
                            )}
                        </Tooltip>
                    )}
                </li>

                {item.followUp ? (
                    <li className={styles.markedForFollowup}>
                        <IconFlag16 color={colors.yellow700} />
                        {i18n.t('Marked for follow-up')}
                    </li>
                ) : null}
            </ul>
            <FollowUpButton item={item} />
        </div>
    )
}

BasicInformation.propTypes = {
    item: ItemPropType.isRequired,
}

export default BasicInformation
