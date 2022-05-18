import i18n from '@dhis2/d2-i18n'
import { CircularLoader } from '@dhis2/ui'
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
import { parsePeriodId } from '../../shared/index.js'
import ToggleableUnit from '../toggleable-unit.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: { display: false },
    },
}


// @TODO: There are no design specs yet
export default function HistoryUnit({ history, loading }) {
    const oldToNewHistory = history.sort((left, right) => {
        const leftStartDate = new Date(parsePeriodId(left.period).startDate)
        const rightStartDate = new Date(parsePeriodId(right.period).startDate)

        if (leftStartDate > rightStartDate) {
            return 1
        }

        if (leftStartDate < rightStartDate) {
            return -1
        }

        return 0
    })

    const labels = oldToNewHistory.map(
        ({ period }) => parsePeriodId(period).displayName
    )

    const data = {
        labels,
        datasets: [
            {
                label: '',
                data: oldToNewHistory.map(({ value }) => Number(value)),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <ToggleableUnit title={i18n.t('History')}>
            {loading && <CircularLoader />}
            {!loading && !history?.length && '@TODO: Show ui for no history'}
            {!loading && history?.length && (
                <Line options={options} data={data} />
            )}
        </ToggleableUnit>
    )
}

HistoryUnit.propTypes = {
    history: PropTypes.arrayOf(
        PropTypes.shape({
            attribute: PropTypes.shape({
                combo: PropTypes.string.isRequired,
                options: PropTypes.arrayOf(PropTypes.string).isRequired,
            }).isRequired,
            categoryOptionCombo: PropTypes.string.isRequired,
            dataElement: PropTypes.string.isRequired,
            followUp: PropTypes.bool.isRequired,
            orgUnit: PropTypes.string.isRequired,
            period: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ),
    loading: PropTypes.bool,
}
