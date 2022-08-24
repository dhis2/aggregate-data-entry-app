import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import PropTypes from 'prop-types'
import React from 'react'
import createIDBPersister from './persister.js'

const persister = createIDBPersister()

const persistOptions = {
    persister,
    maxAge: Infinity,
    dehydrateOptions: {
        dehydrateMutations: true,
        dehydrateQueries: true,
        shouldDehydrateQuery: (query) => {
            const isSuccess = query.state.status === 'success'
            const shouldPersist = query?.meta?.persist === true
            return isSuccess && shouldPersist
        },
    },
    hydrateOptions: {
        defaultOptions: {
            queries: {
                meta: {
                    persist: true,
                    // can be used to check if the query originates from the persisted-store
                    isHydrated: true,
                },
            },
        },
    },
}

export const ConfiguredQueryClientProvider = ({ children, queryClient }) => {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={persistOptions}
        >
            {children}
        </PersistQueryClientProvider>
    )
}

const propTypes = {
    queryClient: PropTypes.instanceOf(QueryClient).isRequired,
    children: PropTypes.node,
}

ConfiguredQueryClientProvider.propTypes = propTypes
