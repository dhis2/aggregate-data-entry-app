import i18n from '@dhis2/d2-i18n'
import { CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import ToggleableUnit from '../toggleable-unit.js'

// @TODO: There are no design specs yet
export default function HistoryUnit({ history, loading }) {
    return (
        <ToggleableUnit title={i18n.t('History')}>
            {loading && <CircularLoader />}
            {!loading && !history?.length && '@TODO: Show ui for no history'}
            {!loading &&
                history?.length &&
                `@TODO: Show ui for history with length ${history.length}`}
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
