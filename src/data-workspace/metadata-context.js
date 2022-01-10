import React, { useState, useMemo, useContext, useCallback } from 'react'

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
    setMetadata: () => {},
})

export const MetadataContextProvider = ({ children }) => {
    const cached = cachedMetadata()
    const [metadata, setContext] = useState(cached ?? {})
    const [loading, setLoading] = useState(true)

    const setMetadata = (value) => {
        setContext(value)
        setLoading(false)
        localStorage.setItem('metadata', JSON.stringify(value))
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

export const useMetadata = () => useContext(MetadataContext)
