import React from 'react'
import { QueryClientProvider } from 'react-query'
import { CurrentItemProvider } from '../current-item-provider/index.js'
import { SidebarProvider } from '../sidebar/index.js'
import App from './app.js'
import useQueryClient from './query-client/use-query-client.js'

const AppWrapper = () => {
    const queryClient = useQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <CurrentItemProvider>
                <SidebarProvider>
                    <App />
                </SidebarProvider>
            </CurrentItemProvider>
        </QueryClientProvider>
    )
}

export default AppWrapper
