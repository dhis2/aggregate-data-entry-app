import { CssReset, CssVariables } from '@dhis2/ui'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import PropTypes from 'prop-types'
import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import HasCommentProvider from '../data-workspace/has-comment/has-comment-provider.js'
import PrintAreaProvider from '../data-workspace/print-area/print-area-provider.js'
import { RightHandPanelProvider } from '../right-hand-panel/index.js'
import {
    FormChangedSincePanelOpenedProvider,
    LockedProvider,
} from '../shared/index.js'
import App from './app.js'
import { ConfiguredQueryClientProvider } from './query-client/configured-query-client-provider.js'
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
    children,
    // This way we can use a different router in tests when needed
    router: Router,
    queryClient,
}) {
    return (
        <>
            <CssReset />
            <CssVariables colors spacers theme />
            <ConfiguredQueryClientProvider queryClient={queryClient}>
                <ReactQueryDevtools />
                <Router>
                    <QueryParamProvider ReactRouterRoute={Route}>
                        <LockedProvider>
                            <FormChangedSincePanelOpenedProvider>
                                <RightHandPanelProvider>
                                    <PrintAreaProvider>
                                        <HasCommentProvider>
                                            {children}
                                        </HasCommentProvider>
                                    </PrintAreaProvider>
                                </RightHandPanelProvider>
                            </FormChangedSincePanelOpenedProvider>
                        </LockedProvider>
                    </QueryParamProvider>
                </Router>
            </ConfiguredQueryClientProvider>
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
