import { CssVariables } from '@dhis2/ui'
import React from 'react'
import './App.css'
import { Layout } from './layout/index.js'

const App = () => {
    return (
        <>
            <CssVariables colors />
            <Layout
                header=""
                main=""
                sidebar=""
                footer=""
                showSidebar
                showFooter
            />
        </>
    )
}

export default App
