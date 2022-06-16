import { CssReset, CssVariables } from '@dhis2/ui'
import React from 'react'
import { ReactQueryDevtools } from 'react-query/dist/react-query-devtools.development'
import { PersistQueryClientProvider } from 'react-query/persistQueryClient'
import { HashRouter as Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { RightHandPanelProvider } from '../right-hand-panel/index.js'
import { CurrentItemProvider } from '../shared/index.js'
import App from './app.js'
import createIDBPersister from './query-client/persister.js'
import useQueryClient from './query-client/use-query-client.js'

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

const AppWrapper = () => {
    const queryClient = useQueryClient()

    return (
        <>
            <CssReset />
            <CssVariables colors spacers theme />
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={persistOptions}
            >
                <ReactQueryDevtools />
                <Router>
                    <QueryParamProvider ReactRouterRoute={Route}>
                        <CurrentItemProvider>
                            <RightHandPanelProvider>
                                <App />
                            </RightHandPanelProvider>
                        </CurrentItemProvider>
                    </QueryParamProvider>
                </Router>
            </PersistQueryClientProvider>
        </>
    )
}

export default AppWrapper
