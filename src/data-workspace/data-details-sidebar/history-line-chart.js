import { useConfig } from '@dhis2/app-runtime'
import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Line } from 'react-chartjs-2'
import {
    isDateAGreaterThanDateB,
    isDateALessThanDateB,
} from '../../shared/index.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const options = {
    responsive: true,
    plugins: {
        legend: { display: false },
    },
}

function sortHistoryByStartDate(history, calendar = 'gregory') {
    // [...history] ->  prevent mutating the original array
    return [...history].sort((left, right) => {
        const leftStartDate = createFixedPeriodFromPeriodId({
            periodId: left.period,
            calendar,
        }).startDate

        const rightStartDate = createFixedPeriodFromPeriodId({
            periodId: right.period,
            calendar,
        }).startDate

        // date comparison
        if (
            isDateAGreaterThanDateB(leftStartDate, rightStartDate, {
                calendar,
                inclusive: false,
            })
        ) {
            return 1
        }

        if (
            isDateALessThanDateB(leftStartDate, rightStartDate, {
                calendar,
                inclusive: false,
            })
        ) {
            return -1
        }

        return 0
    })
}

function createLabelsFromHistory(history, calendar) {
    return history.map(({ period }) => {
        try {
            return createFixedPeriodFromPeriodId({ periodId: period, calendar })
                .displayName
        } catch (e) {
            console.error(e)
            // In case period id is invalid
            return ''
        }
    })
}

export default function HistoryLineChart({ history }) {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    const oldToNewHistory = sortHistoryByStartDate(history, calendar)
    const labels = createLabelsFromHistory(oldToNewHistory, calendar)
    const data = {
        labels,
        datasets: [
            {
                label: '',
                data: oldToNewHistory.map(({ value }) => Number(value)),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderWidth: 1,
            },
        ],
    }

    return <Line options={options} data={data} />
}

HistoryLineChart.propTypes = {
    history: PropTypes.arrayOf(
        PropTypes.shape({
            period: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ),
}
