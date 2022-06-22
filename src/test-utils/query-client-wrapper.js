import { node } from 'prop-types'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

const logger = {
    log: console.log,
    warn: console.warn,
    error: () => {},
}

const queryClientOptions = {
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
    logger,
}

const QueryClientWrapper = ({ children }) => {
    const queryClient = new QueryClient(queryClientOptions)

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

QueryClientWrapper.propTypes = {
    children: node,
}

export default QueryClientWrapper
