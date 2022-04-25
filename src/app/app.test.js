import { DataProvider } from '@dhis2/app-runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { CurrentItemProvider } from '../current-item-provider/index.js'
import { SidebarProvider } from '../sidebar/index.js'
import App from './app.js'

const queryClient = new QueryClient()

describe('<App />', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')

        ReactDOM.render(
            <DataProvider>
                <QueryClientProvider client={queryClient}>
                    <CurrentItemProvider>
                        <SidebarProvider>
                            <App />
                        </SidebarProvider>
                    </CurrentItemProvider>
                </QueryClientProvider>
            </DataProvider>,
            div
        )
        ReactDOM.unmountComponentAtNode(div)
    })
})
