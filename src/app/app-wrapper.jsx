import { CssReset, CssVariables } from '@dhis2/ui'
import { QueryClient } from '@tanstack/react-query'
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
 */
export function OuterComponents({
    children,
    // This way we can use a different router in tests when needed
    router: Router = HashRouter,
    queryClient: customQueryClient,
}) {
    const queryClient = useQueryClient()

    return (
        <>
            <CssReset />
            <CssVariables colors spacers theme />
            <ConfiguredQueryClientProvider
                queryClient={customQueryClient || queryClient}
            >
                {enableRQDevtools && <ReactQueryDevtools />}
                <Router>
                    <QueryParamProvider ReactRouterRoute={Route}>
                        <LockedProvider>
                            <RightHandPanelProvider>
                                <PrintAreaProvider>
                                    {children}
                                </PrintAreaProvider>
                            </RightHandPanelProvider>
                        </LockedProvider>
                    </QueryParamProvider>
                </Router>
            </ConfiguredQueryClientProvider>
        </>
    )
}

OuterComponents.propTypes = {
    children: PropTypes.any.isRequired,
    queryClient: PropTypes.instanceOf(QueryClient).isRequired,
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
