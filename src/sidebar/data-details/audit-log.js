import i18n from '@dhis2/d2-i18n'
import { CircularLoader, Tooltip } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import ToggleableUnit from '../toggleable-unit.js'
import styles from './audit-log.module.css'

const renderMessage = ({ displayName, changeType, newValue, oldValue }) => {
    switch (changeType) {
        case 'UPDATE':
            return i18n.t(
                '{{displayName}} updated to {{newValue}} (was {{oldValue}})',
                {
                    displayName,
                    newValue,
                    oldValue,
                }
            )
        case 'DELETE':
            return i18n.t('{{displayName}} deleted (was {{oldValue}})', {
                displayName,
                newValue,
                oldValue,
            })
        default:
            return `${displayName} ${changeType}`
    }
}

const Entry = ({ entry }) => {
    const timeAgo = moment(entry.at).fromNow()

    return (
        <>
            <span className={styles.entryMessage}>{renderMessage(entry)}</span>
            <Tooltip content={entry.at.toString()}>
                <span className={styles.entryTimeAgo}>{timeAgo}</span>
            </Tooltip>
        </>
    )
}

Entry.propTypes = {
    entry: PropTypes.shape({
        at: PropTypes.instanceOf(Date).isRequired,
        changeType: PropTypes.oneOf(['UPDATE', 'DELETE']).isRequired,
        displayName: PropTypes.string.isRequired,
        newValue: PropTypes.any,
        oldValue: PropTypes.any,
    }).isRequired,
}

const AuditLogUnit = ({ loading, auditLog }) => {
    const isEmptyAuditLog = !Array.isArray(auditLog) || auditLog.length === 0

    return (
        <ToggleableUnit title={i18n.t('Audit log')}>
            {loading && <CircularLoader small />}

            {!loading && isEmptyAuditLog && (
                <p className={styles.placeholder}>
                    {i18n.t('No audit log for this data item.')}
                </p>
            )}

            {!loading && !isEmptyAuditLog && (
                <ul className={styles.entries}>
                    {auditLog
                        .sort((e1, e2) => e2.at - e1.at)
                        .map((entry, index) => (
                            <li key={index} className={styles.entry}>
                                <Entry entry={entry} />
                            </li>
                        ))}
                </ul>
            )}
        </ToggleableUnit>
    )
}

AuditLogUnit.propTypes = {
    auditLog: PropTypes.array,
    loading: PropTypes.bool,
}

export default AuditLogUnit
