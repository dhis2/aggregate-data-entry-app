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

function sortHistoryByStartDate(history) {
    // [...history] ->  prevent mutating the original array
    return [...history].sort((left, right) => {
        // @TODO(calendar)
        const calendar = 'gregory'
        const leftStartDate = new Date(
            createFixedPeriodFromPeriodId({
                periodId: left.period,
                calendar,
            }).startDate
        )
        const rightStartDate = new Date(
            createFixedPeriodFromPeriodId({
                periodId: right.period,
                calendar,
            }).startDate
        )

        if (leftStartDate > rightStartDate) {
            return 1
        }

        if (leftStartDate < rightStartDate) {
            return -1
        }

        return 0
    })
}

function createLabelsFromHistory(history) {
    // @TODO(calendar)
    const calendar = 'gregory'
    return history.map(({ period }) => {
        try {
            return createFixedPeriodFromPeriodId({ periodId: period, calendar })
                .displayName
        } catch (e) {
            // In case period id is invalid
            return ''
        }
    })
}

export default function HistoryLineChart({ history }) {
    const oldToNewHistory = sortHistoryByStartDate(history)
    const labels = createLabelsFromHistory(oldToNewHistory)
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
