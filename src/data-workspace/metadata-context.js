import PropTypes from 'prop-types'
import React, { useState, useMemo, useContext } from 'react'
import { hashArraysInObject } from './utils.js'

const cachedMetadata = () => {
    try {
        return JSON.parse(localStorage.getItem('metadata'))
    } catch (e) {
        return false
    }
}
export const MetadataContext = React.createContext({
    metadata: {},
    loading: true,
    available: false,
    usingCached: false,
    setMetadata: () => {},
})

export const MetadataContextProvider = ({ children }) => {
    const cached = cachedMetadata()
    const [metadata, setContext] = useState(cached ?? {})
    const [loading, setLoading] = useState(true)

    const setMetadata = (value) => {
        const hashed = hashArraysInObject(value)
        console.log('set metadata', hashed)
        setContext(hashed)
        setLoading(false)
        localStorage.setItem('metadata', JSON.stringify(hashed))
    }

    const contextValue = useMemo(
        () => ({
            metadata,
            loading,
            available: !!cached,
            usingCached: loading && cached,
            setMetadata,
        }),
        [metadata, loading, cached]
    )

    return (
        <MetadataContext.Provider value={contextValue}>
            {children}
        </MetadataContext.Provider>
    )
}

MetadataContextProvider.propTypes = {
    children: PropTypes.node,
}

export const useMetadata = () => useContext(MetadataContext)
