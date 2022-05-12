import PropTypes from 'prop-types'

// code: PropTypes.string,
export default PropTypes.shape({
    categoryOptionCombo: PropTypes.string,
    comment: PropTypes.string,
    dataElement: PropTypes.string,
    followup: PropTypes.bool,
    lastUpdated: PropTypes.string,
    name: PropTypes.string,
    storedBy: PropTypes.string,
    value: PropTypes.any,
})
