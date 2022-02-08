import PropTypes from 'prop-types'
import React from 'react'
import CurrentItemContext from './context.js'

// TODO: Get from form instead of hardcoding
const currentItem = {
    id: 'aC392Jk3200',
    name: 'Malaria treated at PHU without ACT',
    code: 'DE2398742',
    lastUpdated: {
        at: new Date('2022-01-14'),
        userDisplayName: 'Mwangi Babatunde',
    },
    markedForFollowup: false,
    type: 'numerical',
}

const CurrentItemProvider = ({ children }) => (
    <CurrentItemContext.Provider value={currentItem}>
        {children}
    </CurrentItemContext.Provider>
)

CurrentItemProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default CurrentItemProvider
