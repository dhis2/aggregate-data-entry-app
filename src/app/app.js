import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { QueryParamProvider } from 'use-query-params'
import './app.css'
import { ContextSelection } from '../context-selection/index.js'
import { Layout } from './layout/index.js'
import useQueryClient from './use-query-client.js'

const App = () => {
    const queryClient = useQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <QueryParamProvider>
                <CssVariables colors />
                <Layout
                    header={<ContextSelection />}
                    main=""
                    sidebar=""
                    footer=""
                    showSidebar
                    showFooter
                />
            </QueryParamProvider>
        </QueryClientProvider>
    )
}

export default App
