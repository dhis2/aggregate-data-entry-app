import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import styles from './audit-log.module.css'
import LoadingError from './loading-error.js'
import ToggleableUnit from './toggleable-unit.js'

// TODO
const query = {
    auditLog: {
        resource: 'auditLog',
        id: ({ id }) => id,
    },
}

// TODO: find better way to do this
const renderMessage = ({ displayName, changeType, newValue, oldValue }) => {
    switch (changeType) {
        case 'UPDATE':
            return i18n.t(
                '{{displayName}} <span class="{{typeClass}}">updated</span> to {{newValue}} (was {{oldValue}})',
                {
                    displayName,
                    typeClass: styles.entryType,
                    newValue,
                    oldValue,
                }
            )
        case 'DELETE':
            return i18n.t(
                '{{displayName}} <span class="{{typeClass}}">deleted</span> (was {{oldValue}})',
                {
                    displayName,
                    typeClass: styles.entryTypeDeleted,
                    newValue,
                    oldValue,
                }
            )
        default:
            return `${displayName} ${changeType}`
    }
}

const Entry = ({ entry }) => {
    const timeAgo = moment(entry.at).fromNow()

    return (
        <>
            <span
                className={styles.entryMessage}
                dangerouslySetInnerHTML={{ __html: renderMessage(entry) }}
            ></span>
            <span className={styles.entryTimeAgo}>{timeAgo}</span>
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

const AuditLog = ({ itemId }) => {
    const { called, loading, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        refetch({ id: itemId })
    }, [itemId])

    if (!called || loading) {
        return <CircularLoader small />
    }

    if (error) {
        return (
            <LoadingError
                title={i18n.t(
                    'There was a problem loading the audit log for this data item'
                )}
            />
        )
    }

    return (
        <ul className={styles.entries}>
            {data.auditLog
                .sort((e1, e2) => e2.at - e1.at)
                .map((entry, index) => (
                    <li key={index} className={styles.entry}>
                        <Entry entry={entry} />
                    </li>
                ))}
        </ul>
    )
}

AuditLog.propTypes = {
    itemId: PropTypes.string.isRequired,
}

const AuditLogUnit = ({ itemId }) => (
    <ToggleableUnit title={i18n.t('Audit log')}>
        <AuditLog itemId={itemId} />
    </ToggleableUnit>
)

AuditLogUnit.propTypes = {
    itemId: PropTypes.string.isRequired,
}

export default AuditLogUnit
