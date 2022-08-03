import PropTypes from 'prop-types'
import React from 'react'
import { QueryClient } from 'react-query'
import { PersistQueryClientProvider } from 'react-query/persistQueryClient'
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
}
export const ConfiguredQueryClientProvider = ({ queryClient, children }) => {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={persistOptions}
        >
            {children}
        </PersistQueryClientProvider>
    )
}
ConfiguredQueryClientProvider.propTypes = {
    queryClient: PropTypes.instanceOf(QueryClient).isRequired,
    children: PropTypes.node,
}
