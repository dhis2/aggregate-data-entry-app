import i18n from '@dhis2/d2-i18n'
import { CircularLoader, Tooltip } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { ToggleableUnit } from '../../shared/index.js'
import styles from './audit-log.module.css'

const renderMessage = ({ modifiedBy, auditType, value, prevValue }) => {
    if (auditType === 'UPDATE' && typeof prevValue === 'undefined') {
        return i18n.t('{{user}} set to {{value}}', { user: modifiedBy, value })
    }

    if (auditType === 'UPDATE') {
        return i18n.t('{{user}} updated to {{value}} (was {{prevValue}})', {
            user: modifiedBy,
            value,
            prevValue,
        })
    }

    if (auditType === 'DELETE') {
        return i18n.t('{{user}} deleted (was {{prevValue}})', {
            user: modifiedBy,
            value,
            prevValue,
        })
    }

    return auditType
}

const Entry = ({ entry }) => {
    const timeAgo = moment(entry.created).fromNow()

    return (
        <>
            <span className={styles.entryMessage}>{renderMessage(entry)}</span>
            <Tooltip content={entry.created}>
                <span className={styles.entryTimeAgo}>{timeAgo}</span>
            </Tooltip>
        </>
    )
}

Entry.propTypes = {
    entry: PropTypes.shape({
        auditType: PropTypes.oneOf(['UPDATE', 'DELETE']).isRequired,
        created: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        prevValue: PropTypes.string,
    }).isRequired,
}

const AuditLogUnit = ({ loading, audits }) => {
    const isEmptyAuditLog = !Array.isArray(audits) || audits.length === 0
    // Do not modify original array, sort mutates the array
    const newToOldAuditLog = [...audits].sort((left, right) => {
        const lCreated = new Date(left.created)
        const rCreated = new Date(right.created)
        return lCreated === rCreated ? 0 : lCreated < rCreated ? 1 : -1
    })

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
                    {!newToOldAuditLog.length && (
                        <span>{i18n.t('No audit log for this data item')}</span>
                    )}

                    {newToOldAuditLog.map((entry, index, all) => {
                        const payload = {
                            ...entry,
                            prevValue: all[index + 1]?.value,
                        }

                        return (
                            <li key={index} className={styles.entry}>
                                <Entry entry={payload} />
                            </li>
                        )
                    })}
                </ul>
            )}
        </ToggleableUnit>
    )
}

AuditLogUnit.defaultProps = {
    audits: [],
}

AuditLogUnit.propTypes = {
    audits: PropTypes.arrayOf(
        PropTypes.shape({
            auditType: PropTypes.string,
            created: PropTypes.string,
            modifiedBy: PropTypes.string,
            prevValue: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    loading: PropTypes.bool,
}

export default AuditLogUnit
