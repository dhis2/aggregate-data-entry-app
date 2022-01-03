import React, { useState, useMemo } from 'react'

export const MetadataContext = React.createContext({
    metadata: {},
    setMetadata: () => {},
})

export const MetadataContextProvider = ({ children }) => {
    const [metadata, setMetadata] = useState({})

    const contextValue = useMemo(() => ({ metadata, setMetadata }), [metadata])

    return (
        <MetadataContext.Provider value={contextValue}>
            {children}
        </MetadataContext.Provider>
    )
}
