import { CssReset, CssVariables } from '@dhis2/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import PropTypes from 'prop-types'
import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import PrintAreaProvider from '../data-workspace/print-area/print-area-provider.jsx'
import { RightHandPanelProvider } from '../right-hand-panel/index.js'
import { LockedProvider } from '../shared/index.js'
import '../locales/index.js'
import App from './app.jsx'
import { ConfiguredQueryClientProvider } from './query-client/configured-query-client-provider.jsx'
import useQueryClient from './query-client/use-query-client.js'

const enableRQDevtools = process.env.REACT_APP_ENABLE_RQ_DEVTOOLS === 'true'

/**
 * @param {Object} props
 * @param {QueryClient} props.queryClient
 * @param {*} props.children
 * @param {Function} props.router
 * This way we can use a different router in tests in conjunction with the
 * original render function of @testing-library/react when needed, e.g:
 *     router={({ children }) => (
 *         <MemoryRouter initialEntries={['?dataSet=...&...']}>
 *             {children}
 *         </MemoryRouter>
 *     )}
 * @param {boolean} props.persist
 * Whether queries are persisted to IndexedDB for offline use. Embedders that
 * show data that isn't the user's own data entry (e.g. aggregated report
 * values) must not persist it, or the app would later read it back as such.
 * @param {boolean} props.readOnly
 * Locks every field, as if the form were locked by the server.
 */
export function OuterComponents({
    children,
    // This way we can use a different router in tests when needed
    router: Router = HashRouter,
    queryClient: customQueryClient,
    persist = true,
    readOnly = false,
}) {
    const defaultQueryClient = useQueryClient()
    const queryClient = customQueryClient || defaultQueryClient

    const content = (
        <>
            {enableRQDevtools && <ReactQueryDevtools />}
            <Router>
                <QueryParamProvider ReactRouterRoute={Route}>
                    <LockedProvider forceLocked={readOnly}>
                        <RightHandPanelProvider>
                            <PrintAreaProvider>{children}</PrintAreaProvider>
                        </RightHandPanelProvider>
                    </LockedProvider>
                </QueryParamProvider>
            </Router>
        </>
    )

    return (
        <>
            <CssReset />
            <CssVariables colors spacers theme />
            {persist ? (
                <ConfiguredQueryClientProvider queryClient={queryClient}>
                    {content}
                </ConfiguredQueryClientProvider>
            ) : (
                <QueryClientProvider client={queryClient}>
                    {content}
                </QueryClientProvider>
            )}
        </>
    )
}

OuterComponents.propTypes = {
    children: PropTypes.any.isRequired,
    queryClient: PropTypes.instanceOf(QueryClient).isRequired,
    persist: PropTypes.bool,
    readOnly: PropTypes.bool,
    // in js classes are functions, too
    router: PropTypes.elementType,
}

// Must be default export as this is the component point to by "d2.config.js"
const AppWrapper = () => (
    <OuterComponents>
        <App />
    </OuterComponents>
)

export default AppWrapper
