import i18n from '@dhis2/d2-i18n'
import { Button, IconFlag16, IconFlag24, colors } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './basic-information.module.css'
import ItemPropType from './item-prop-type.js'
import unitStyles from './unit.module.css'

const BasicInformation = ({ item, onMarkForFollowup, onUnmarkForFollowup }) => (
    <div className={unitStyles.unit}>
        <h1 className={unitStyles.title}>{item.name}</h1>
        <ul className={styles.elements}>
            <li>
                {i18n.t('Code: {{code}}', {
                    code: item.code,
                    nsSeparator: '-:-',
                })}
            </li>
            <li>
                {i18n.t('ID: {{id}}', {
                    id: item.id,
                    nsSeparator: '-:-',
                })}
            </li>
            <li>
                {i18n.t('Last updated {{- timeAgo}} by {{- name}}', {
                    timeAgo: moment(item.lastUpdated.at).fromNow(),
                    name: item.lastUpdated.userDisplayName,
                })}
            </li>
            {item.markedForFollowup ? (
                <li className={styles.markedForFollowup}>
                    <IconFlag16 color={colors.yellow700} />
                    {i18n.t('Marked for follow-up')}
                </li>
            ) : null}
        </ul>
        {item.markedForFollowup ? (
            <Button small secondary onClick={onUnmarkForFollowup}>
                {i18n.t('Unmark for follow-up')}
            </Button>
        ) : (
            <Button
                small
                secondary
                icon={<IconFlag24 color={colors.grey600} />}
                onClick={onMarkForFollowup}
            >
                {i18n.t('Mark for follow-up')}
            </Button>
        )}
    </div>
)

BasicInformation.propTypes = {
    item: ItemPropType.isRequired,
    onMarkForFollowup: PropTypes.func.isRequired,
    onUnmarkForFollowup: PropTypes.func.isRequired,
}

export default BasicInformation
