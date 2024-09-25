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
import { ExpandableUnit, useConnectionStatus } from '../../shared/index.js'
import styles from './audit-log.module.css'
import useDataValueContext from './use-data-value-context.js'
import useOpenState from './use-open-state.js'

const title = i18n.t('Audit log')

export default function AuditLog({ item }) {
    const { offline } = useConnectionStatus()
    const { open, setOpen, openRef } = useOpenState(item)
    const dataValueContext = useDataValueContext(item, openRef.current)
    const { systemInfo = {} } = useConfig()
    const { serverTimeZoneId: timezone = 'Etc/UTC' } = systemInfo

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
                            <DataTableColumnHeader>Date</DataTableColumnHeader>
                            <DataTableColumnHeader>User</DataTableColumnHeader>
                            <DataTableColumnHeader>
                                Change
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>

                    <TableBody>
                        {audits.map((audit) => {
                            const {
                                modifiedBy: user,
                                previousValue,
                                value,
                                created,
                                auditType,
                                dataElement: de,
                                categoryOptionCombo: coc,
                                period: pe,
                                orgUnit: ou,
                            } = audit
                            const key = `${de}-${pe}-${ou}-${coc}-${created}`

                            return (
                                <DataTableRow key={key}>
                                    <DataTableCell>
                                        {created
                                            ? `${created
                                                  .substring(0, 16)
                                                  .replace(
                                                      'T',
                                                      ' '
                                                  )} (${timezone})`
                                            : null}
                                    </DataTableCell>
                                    <DataTableCell>{user}</DataTableCell>
                                    <DataTableCell>
                                        <div>
                                            {auditType === 'DELETE' && (
                                                <DeletedValue value={value} />
                                            )}
                                            {['UPDATE', 'CREATE'].includes(
                                                auditType
                                            ) && (
                                                <UpdatedValue
                                                    value={value}
                                                    previousValue={
                                                        previousValue
                                                    }
                                                />
                                            )}
                                        </div>
                                    </DataTableCell>
                                </DataTableRow>
                            )
                        })}
                    </TableBody>
                </DataTable>
            </div>
        </ExpandableUnit>
    )
}

AuditLog.propTypes = {
    item: PropTypes.shape({
        categoryOptionCombo: PropTypes.string.isRequired,
        dataElement: PropTypes.string.isRequired,
        comment: PropTypes.string,
    }).isRequired,
}

function DeletedValue({ value }) {
    return (
        <Tag negative className={styles.lineThrough}>
            {value}
        </Tag>
    )
}

DeletedValue.propTypes = {
    value: PropTypes.string.isRequired,
}

function UpdatedValue({ value, previousValue }) {
    return (
        <div className={styles.alignToEnd}>
            {previousValue && <Tag>{previousValue}</Tag>}
            {/* arrow-right*/}
            <span className={styles.rightArrow}>&rarr;</span>
            <Tag>{value}</Tag>
        </div>
    )
}

UpdatedValue.propTypes = {
    value: PropTypes.string.isRequired,
    previousValue: PropTypes.string,
}
