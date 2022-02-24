import React from 'react'
import { QueryClientProvider } from 'react-query'
import App from './app.js'
import useQueryClient from './query-client/use-query-client.js'

const AppWrapper = () => {
    const queryClient = useQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    )
}

export default AppWrapper
