import { DataProvider } from '@dhis2/app-runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'

describe('<App />', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')

        ReactDOM.render(
            <DataProvider>
                <App />
            </DataProvider>,
            div
        )
        ReactDOM.unmountComponentAtNode(div)
    })
})
