import PropTypes from 'prop-types'

export default PropTypes.shape({
    code: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    lastUpdated: PropTypes.shape({
        at: PropTypes.instanceOf(Date).isRequired,
        userDisplayName: PropTypes.string.isRequired,
    }).isRequired,
    markedForFollowup: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
})
