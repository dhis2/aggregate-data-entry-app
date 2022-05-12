import PropTypes from 'prop-types'
import React, { useState } from 'react'
import CurrentItemContext from './context.js'

const CurrentItemProvider = ({ children }) => {
    const [currentItem, setCurrentItem] = useState({})

    const value = {
        currentItem,
        setCurrentItem,
    }

    return (
        <CurrentItemContext.Provider value={value}>
            {children}
        </CurrentItemContext.Provider>
    )
}

CurrentItemProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default CurrentItemProvider
