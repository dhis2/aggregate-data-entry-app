/* eslint-disable react/prop-types */
import { DataProvider } from '@dhis2/app-runtime'
import { render as renderOrig } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { OuterComponents } from '../app/app-wrapper.js'
import { useTestQueryClient } from './use-test-query-client.js'

export function TestWrapper({
    wrapper: WrapperFromOptions,
    router = MemoryRouter,
    queryClient,
    children,
}) {
    const defaultTestQueryClient = useTestQueryClient()

    const content = (
        <OuterComponents
            queryClient={queryClient ?? defaultTestQueryClient}
            router={router}
        >
            {children}
        </OuterComponents>
    )

    if (!WrapperFromOptions) {
        return content
    }

    return <WrapperFromOptions>{content}</WrapperFromOptions>
}

export function render(ui, options = {}) {
    return renderOrig(ui, {
        ...options,
        wrapper: ({ children }) => (
            <DataProvider baseUrl="http://dhis2-tests.org" apiVersion="39">
                <TestWrapper {...options}>{children}</TestWrapper>
            </DataProvider>
        ),
    })
}
