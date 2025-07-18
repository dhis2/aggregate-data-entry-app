/* eslint-disable react/prop-types */
import { CustomDataProvider, Provider } from '@dhis2/app-runtime'
import { render as renderOrig } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { OuterComponents } from '../app/app-wrapper.jsx'
import { useTestQueryClient } from './use-test-query-client.js'

export function TestWrapper({
    wrapper: WrapperFromOptions,
    router = MemoryRouter,
    queryClient,
    queryClientOptions,
    children,
}) {
    const defaultTestQueryClient = useTestQueryClient(queryClientOptions)

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

export function Wrapper({
    dataForCustomProvider,
    queryClientOptions,
    timezone,
    children,
    ...restOptions
}) {
    return (
        <Provider
            baseUrl="http://dhis2-tests.org"
            apiVersion="41"
            config={{ systemInfo: { serverTimeZoneId: timezone } }}
        >
            <CustomDataProvider
                data={dataForCustomProvider}
                queryClientOptions={queryClientOptions}
            >
                <TestWrapper
                    queryClientOptions={queryClientOptions}
                    {...restOptions}
                >
                    {children}
                </TestWrapper>
            </CustomDataProvider>
        </Provider>
    )
}

export function render(ui, options = {}) {
    const {
        dataForCustomProvider,
        timezone = 'Etc/UTC',
        ...restOptions
    } = options
    return renderOrig(ui, {
        ...options,
        wrapper: ({ children }) => (
            <Wrapper
                {...restOptions}
                timezone={timezone}
                dataForCustomProvider={dataForCustomProvider}
            >
                {children}
            </Wrapper>
        ),
    })
}
