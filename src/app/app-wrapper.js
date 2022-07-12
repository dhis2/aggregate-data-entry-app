import { CssReset, CssVariables } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HashRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import PrintAreaProvider from '../data-workspace/print-area/print-area-provider.js'
import { RightHandPanelProvider } from '../right-hand-panel/index.js'
import { HighlightedFieldIdProvider } from '../shared/index.js'
import App from './app.js'
import useQueryClient from './query-client/use-query-client.js'

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
    queryClient,
    children,
    // This way we can use a different router in tests when needed
    router: Router,
}) {
    return (
        <>
            <CssReset />
            <CssVariables colors spacers theme />
            <QueryClientProvider client={queryClient}>
                <Router>
                    <QueryParamProvider ReactRouterRoute={Route}>
                        <HighlightedFieldIdProvider>
                            <RightHandPanelProvider>
                                <PrintAreaProvider>
                                    {children}
                                </PrintAreaProvider>
                            </RightHandPanelProvider>
                        </HighlightedFieldIdProvider>
                    </QueryParamProvider>
                </Router>
            </QueryClientProvider>
        </>
    )
}

OuterComponents.defaultProps = {
    router: HashRouter,
}

OuterComponents.propTypes = {
    children: PropTypes.any.isRequired,
    queryClient: PropTypes.instanceOf(QueryClient).isRequired,
    // in js classes are functions, too
    router: PropTypes.elementType,
}

// Must be default export as this is the component point to by "d2.config.js"
export default function AppWrapper() {
    const queryClient = useQueryClient()

    return (
        <OuterComponents queryClient={queryClient}>
            <App />
        </OuterComponents>
    )
}
