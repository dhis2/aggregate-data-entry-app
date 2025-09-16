import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow,
    NoticeBox,
    TableBody,
    TableHead,
    Tag,
    Tooltip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    ExpandableUnit,
    useConnectionStatus,
    DateText,
    convertFromIso8601ToString,
    VALUE_TYPES,
} from '../../shared/index.js'
import styles from './audit-log.module.css'
import useDataValueContext from './use-data-value-context.js'
import useOpenState from './use-open-state.js'

const title = i18n.t('Audit log')

export default function AuditLog({ item }) {
    const { offline } = useConnectionStatus()
    const { open, setOpen, openRef } = useOpenState(item)
    const dataValueContext = useDataValueContext(item, openRef.current)
    const timeZone = Intl.DateTimeFormat()?.resolvedOptions()?.timeZone
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    if (!offline && (!open || dataValueContext.isLoading)) {
        return (
            <ExpandableUnit title={title} open={open} onToggle={setOpen}>
                <CircularLoader small />
            </ExpandableUnit>
        )
    }

    if (!offline && dataValueContext.error) {
        return (
            <ExpandableUnit title={title} open={open} onToggle={setOpen}>
                <NoticeBox
                    title={i18n.t('Something went wrong loading the audit log')}
                >
                    <p>{dataValueContext.error.toString()}</p>
                </NoticeBox>
            </ExpandableUnit>
        )
    }

    if (offline && !dataValueContext.data) {
        return (
            <Tooltip content={i18n.t('Not available offline')}>
                <ExpandableUnit
                    disabled
                    title={title}
                    open={false}
                    onToggle={() => null}
                />
            </Tooltip>
        )
    }

    const audits = dataValueContext.data?.audits || []
    const isEmptyAuditLog = !Array.isArray(audits) || audits.length === 0

    if (isEmptyAuditLog) {
        return (
            <ExpandableUnit title={title} open={open} onToggle={setOpen}>
                <p className={styles.placeholder}>
                    {i18n.t('No audit log for this data item.')}
                </p>
            </ExpandableUnit>
        )
    }

    return (
        <ExpandableUnit title={title} open={open} onToggle={setOpen}>
            <div className={styles.tableWrapper}>
                <DataTable>
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader>
                                {i18n.t('Date')}
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                {i18n.t('User')}
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                {i18n.t('Change')}
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>

                    <TableBody>
                        {audits.map((audit) => {
                            const {
                                modifiedBy: user,
                                value: nonParsedValue,
                                created,
                                auditType,
                                dataElement: de,
                                categoryOptionCombo: coc,
                                period: pe,
                                orgUnit: ou,
                            } = audit

                            const value = [
                                VALUE_TYPES.DATETIME,
                                VALUE_TYPES.DATE,
                            ].includes(item.valueType)
                                ? convertFromIso8601ToString(
                                      nonParsedValue,
                                      calendar
                                  )
                                : nonParsedValue

                            const key = `${de}-${pe}-${ou}-${coc}-${created}`

                            return (
                                <DataTableRow key={key}>
                                    <DataTableCell>
                                        {created ? (
                                            <DateText
                                                date={created}
                                                includeTimeZone={false}
                                            />
                                        ) : null}
                                    </DataTableCell>
                                    <DataTableCell>{user}</DataTableCell>
                                    <DataTableCell>
                                        <div>
                                            {auditType === 'DELETE' && (
                                                <DeletedValue value={value} />
                                            )}
                                            {['UPDATE', 'CREATE'].includes(
                                                auditType
                                            ) && <UpdatedValue value={value} />}
                                        </div>
                                    </DataTableCell>
                                </DataTableRow>
                            )
                        })}
                    </TableBody>
                </DataTable>
                {audits.length > 0 && (
                    <div>
                        <div className={styles.timeZoneNote}>
                            {i18n.t(
                                'audit dates are given in {{- timeZone}} time',
                                { timeZone }
                            )}
                        </div>
                        <div className={styles.timeZoneNote}>
                            {i18n.t(
                                'log displays only changes made while audit was enabled'
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ExpandableUnit>
    )
}

AuditLog.propTypes = {
    item: PropTypes.shape({
        categoryOptionCombo: PropTypes.string.isRequired,
        dataElement: PropTypes.string.isRequired,
        comment: PropTypes.string,
        valueType: PropTypes.string,
    }).isRequired,
}

function DeletedValue({ value }) {
    return (
        <div className={styles.alignToEnd}>
            <Tag negative className={styles.lineThrough}>
                {value}
            </Tag>
        </div>
    )
}

DeletedValue.propTypes = {
    value: PropTypes.string.isRequired,
}

function UpdatedValue({ value }) {
    return (
        <div className={styles.alignToEnd}>
            {i18n.dir() === 'rtl' ? (
                <span className={styles.rightArrow}>&larr;</span>
            ) : (
                <span className={styles.rightArrow}>&rarr;</span>
            )}

            <Tag>{value}</Tag>
        </div>
    )
}

UpdatedValue.propTypes = {
    value: PropTypes.string.isRequired,
}
