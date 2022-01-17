import PropTypes from 'prop-types'
import React, { useState, useMemo, useContext, useCallback } from 'react'
import { useQuery } from 'react-query'
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

MetadataContextProvider.propTypes = {
    children: PropTypes.node,
}

const metadataQuery = {
    metadata: {
        resource: 'metadata',
        params: {
            // Note: on dataSet.dataSetElement, the categoryCombo property is
            // included because it can mean it's overriding the data element's
            // native categoryCombo. It can sometimes be absent from the data
            // set element
            'dataSets:fields':
                'id,displayFormName,formType,dataSetElements[dataElement,categoryCombo],categoryCombo,sections~pluck',
            'dataElements:fields': 'id,displayFormName,categoryCombo,valueType',
            'sections:fields':
                'id,displayName,sortOrder,showRowTotals,showColumnTotals,disableDataElementAutoGroup,greyedFields[id],categoryCombos~pluck,dataElements~pluck,indicators~pluck',
            'categoryCombos:fields':
                'id,skipTotal,categories~pluck,categoryOptionCombos~pluck,isDefault',
            'categories:fields': 'id,displayFormName,categoryOptions~pluck',
            'categoryOptions:fields':
                'id,displayFormName,categoryOptionCombos~pluck,categoryOptionGroups~pluck,isDefault',
            'categoryOptionCombos:fields':
                'id,categoryOptions~pluck,categoryCombo,name',
        },
    },
}

export const useMetadata = () => {
    const context = useContext(MetadataContext)

    useQuery([metadataQuery], {
        onSuccess: (metadata) => {
            const hashed =
                metadata?.metadata && hashArraysInObject(metadata.metadata)
            context.setMetadata(hashed)
        },
        staleTime: 60 * 24 * 1000,
        refetchOnWindowFocus: false,
    })

    return context
}
