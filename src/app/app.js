import { useDataEngine } from '@dhis2/app-runtime'
import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import './app.css'
import { Layout } from './layout/index.js'

const App = () => {
    const engine = useDataEngine()

    // https://react-query.tanstack.com/guides/query-keys
    const queryFn = ({ queryKey }) => {
        const [query, variables] = queryKey
        return engine.query(query, { variables })
    }

    // https://react-query.tanstack.com/guides/default-query-function
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                queryFn,
            },
        },
    })

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
