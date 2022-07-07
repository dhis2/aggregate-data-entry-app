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
} from '@dhis2/ui'
import moment from 'moment'
import React from 'react'
import { ExpandableUnit, useCurrentItemContext } from '../../shared/index.js'
import styles from './audit-log.module.css'
import useDataValueContext from './use-data-value-context.js'
import useOpenState from './use-open-state.js'

const title = i18n.t('Audit log')

function sortAuditsByCreatedDate(audits) {
    // Do not modify original array, sort mutates the array
    return [...audits].sort((left, right) => {
        const lCreated = new Date(left.created)
        const rCreated = new Date(right.created)
        return lCreated === rCreated ? 0 : lCreated < rCreated ? 1 : -1
    })
}

export default function AuditLog() {
    const { item } = useCurrentItemContext()
    const { open, setOpen, openRef } = useOpenState(item)
    const dataValueContext = useDataValueContext(item, openRef.current)

    if (!open || dataValueContext.isLoading) {
        return (
            <ExpandableUnit
                title={title}
                open={open}
                onToggle={setOpen}
            >
                <CircularLoader small />
            </ExpandableUnit>
        )
    }

    if (dataValueContext.error) {
        return (
            <ExpandableUnit
                title={title}
                open={open}
                onToggle={setOpen}
            >
                <NoticeBox
                    title={i18n.t('Something went wrong loading the audit log')}
                >
                    <p>{dataValueContext.error.toString()}</p>
                </NoticeBox>
            </ExpandableUnit>
        )
    }

    const audits = dataValueContext.data?.audits || []
    const isEmptyAuditLog = !Array.isArray(audits) || audits.length === 0

    if (isEmptyAuditLog) {
        return (
            <ExpandableUnit
                title={title}
                open={open}
                onToggle={setOpen}
            >
                <p className={styles.placeholder}>
                    {i18n.t('No audit log for this data item.')}
                </p>
            </ExpandableUnit>
        )
    }

    const newToOldAuditLog = sortAuditsByCreatedDate(audits)

    return (
        <ExpandableUnit
            title={title}
            open={open}
            onToggle={setOpen}
        >
            <DataTable>
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>
                            Date
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            User
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            New value
                        </DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>

                <TableBody>
                    {newToOldAuditLog.map((entry, index) => {
                        const { modifiedBy: user, value, created, auditType } = entry

                        return (
                            <DataTableRow key={index}>
                                <DataTableCell>
                                    {moment(created).format('YYYY-MM-DD HH:mm')}
                                </DataTableCell>
                                <DataTableCell>
                                    {user}
                                </DataTableCell>
                                <DataTableCell>
                                    <div style={{ textAlign: 'right' }}>
                                        {
                                            auditType === 'DELETE'
                                                ? <Tag negative>{i18n.t('Deleted')}</Tag>
                                                : value
                                        }
                                    </div>
                                </DataTableCell>
                            </DataTableRow>
                        )
                    })}
                </TableBody>
            </DataTable>
        </ExpandableUnit>
    )
}
