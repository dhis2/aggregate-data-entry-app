import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import PropTypes from 'prop-types'
import React from 'react'
import { shouldPersistError } from '../../shared/index.js'
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
        shouldDehydrateMutation: (mutation) => {
            const persistError =
                mutation.state.status === 'error' &&
                shouldPersistError(mutation.state.error)
            return mutation.state.isPaused || persistError
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
export const ConfiguredQueryClientProvider = ({
    queryClient,
    persist = true,
    children,
}) => {
    // e.g. when embedded in another app, which shouldn't restore this app's
    // offline cache or send its queued data values
    if (!persist) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
    }

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
    persist: PropTypes.bool,
}
