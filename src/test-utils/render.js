/* eslint-disable react/prop-types */
import { render as renderOrig } from '@testing-library/react'
import React from 'react'
import { QueryClient } from 'react-query'
import { MemoryRouter } from 'react-router-dom'
import { OuterComponents } from '../app/app-wrapper.js'

export function TestWrapper({
    wrapper: WrapperFromOptions,
    router = MemoryRouter,
    queryClient,
    children,
}) {
    const content = (
        <OuterComponents queryClient={queryClient} router={router}>
            {children}
        </OuterComponents>
    )

    if (!WrapperFromOptions) {
        return content
    }

    return <WrapperFromOptions>{content}</WrapperFromOptions>
}

export function render(ui, options = {}) {
    const queryClient = new QueryClient()

    return renderOrig(ui, {
        ...options,
        wrapper: ({ children }) => (
            <TestWrapper wrapper={options.wrapper} queryClient={queryClient}>
                {children}
            </TestWrapper>
        ),
    })
}
