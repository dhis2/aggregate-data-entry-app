import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import './app.css'
import { Layout } from './layout/index.js'
import useQueryClient from './use-query-client.js'

const App = () => {
    const queryClient = useQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <CssVariables colors />
            <Layout
                header=""
                main=""
                sidebar=""
                footer=""
                showSidebar
                showFooter
            />
        </QueryClientProvider>
    )
}

export default App
