import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    ExpandableUnit,
    useConnectionStatus,
    usePeriodId,
} from '../../shared/index.js'
import HistoryLineChart from './history-line-chart.js'
import styles from './history.module.css'
import useDataValueContext from './use-data-value-context.js'
import useOpenState from './use-open-state.js'

const title = i18n.t('History')

const onlyValueInPresentPeriod = ({ history, periodId }) => {
    if (history?.length > 1) {
        return false
    }
    if (history?.[0]?.period === periodId) {
        return true
    }
    return false
}

export default function History({ item }) {
    const { offline } = useConnectionStatus()
    const { open, setOpen, openRef } = useOpenState(item)
    const dataValueContext = useDataValueContext(item, openRef.current)
    const [periodId] = usePeriodId()

    if (!offline && (!open || dataValueContext.isLoading)) {
        return (
            <ExpandableUnit title={title} open={open} onToggle={setOpen}>
                <CircularLoader />
            </ExpandableUnit>
        )
    }

    if (!offline && dataValueContext.error) {
        return (
            <ExpandableUnit title={title} open={open} onToggle={setOpen}>
                <NoticeBox
                    title={i18n.t('Something went wrong loading the history')}
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

    const history = dataValueContext.data?.history || []

    if (!history.length || onlyValueInPresentPeriod({ history, periodId })) {
        return (
            <ExpandableUnit title={title} open={open} onToggle={setOpen}>
                <p className={styles.placeholder}>
                    {i18n.t('No history for this data item.')}
                </p>
            </ExpandableUnit>
        )
    }

    return (
        <ExpandableUnit
            title={i18n.t('History')}
            open={open}
            onToggle={setOpen}
        >
            <HistoryLineChart history={history} />
        </ExpandableUnit>
    )
}

History.propTypes = {
    item: PropTypes.shape({
        categoryOptionCombo: PropTypes.string.isRequired,
        dataElement: PropTypes.string.isRequired,
        comment: PropTypes.string,
    }).isRequired,
}
