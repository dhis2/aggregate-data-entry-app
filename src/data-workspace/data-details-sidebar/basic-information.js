import i18n from '@dhis2/d2-i18n'
import { Tooltip, IconFlag16, colors } from '@dhis2/ui'
import moment from 'moment'
import React from 'react'
import { useDateStringAtServerTimezone } from '../../shared/index.js'
import FollowUpButton from './basic-information-follow-up-button.js'
import styles from './basic-information.module.css'
import ItemPropType from './item-prop-type.js'

const BasicInformation = ({ item }) => {
    // This might pass "undefined" to moment and subsequently a wrong
    // "timeAgo", but in that case we won't render anything anyway, so there's
    // nothing to worry about in case there is no "item"
    const lastUpdatedUtcDate = moment.utc(item?.lastUpdated).getDate()
    const adjustedLastUpdated = useDateStringAtServerTimezone(lastUpdatedUtcDate)
    const timeAgo = moment(adjustedLastUpdated).fromNow()

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
                        <Tooltip content={item.lastUpdated.toString()}>
                            {i18n.t('Last updated {{- timeAgo}} by {{- name}}', {
                                timeAgo,
                                name: item.storedBy,
                            })}
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
