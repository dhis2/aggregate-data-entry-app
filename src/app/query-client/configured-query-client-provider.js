import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import PropTypes from 'prop-types'
import React from 'react'
import createIDBPersister from './persister.js'

const persister = createIDBPersister()

const persistErrorTypes = new Set(['network', 'access'])

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
        shouldDehydrateMutation: (mutation) => {
            const shouldPersistError =
                mutation.state.status === 'error' &&
                persistErrorTypes.has(mutation.state.error?.type)
            return mutation.state.isPaused || shouldPersistError
        },
    },
    hydrateOptions: {
        defaultOptions: {
            queries: {
                meta: {
                    // meta-property is not persisted, so this makes sure dehydrated-queries will
                    // be persisted again
                    persist: true,
                    // can be used to check if the query originates from the persisted-store
                    isHydrated: true,
                },
            },
        },
    },
}
export const ConfiguredQueryClientProvider = ({ queryClient, children }) => {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={persistOptions}
            onSuccess={() => {
                queryClient.resumePausedMutations()
            }}
        >
            {children}
        </PersistQueryClientProvider>
    )
}
ConfiguredQueryClientProvider.propTypes = {
    queryClient: PropTypes.instanceOf(QueryClient).isRequired,
    children: PropTypes.node,
}
