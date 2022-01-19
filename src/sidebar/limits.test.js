import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Limits from './limits.js'

describe('<Limits />', () => {
    it('is collapsed by default', () => {
        const { getByRole } = render(
            <CustomDataProvider options={{ loadForever: true }}>
                <Limits itemId="item-1" itemType="numerical" />
            </CustomDataProvider>
        )

        expect(getByRole('group')).not.toHaveAttribute('open')
    })

    it(`is disabled if value of itemType prop is not 'numerical'`, () => {
        const { getByText } = render(
            <CustomDataProvider options={{ loadForever: true }}>
                <Limits itemId="item-1" itemType="text" />
            </CustomDataProvider>
        )

        expect(getByText('Minimum and maximum limits (disabled)')).toBeInTheDocument()
    })

    it('renders a loading spinner whilst loading the item limits', async () => {
        const { getByRole, container } = render(
            <CustomDataProvider options={{ loadForever: true }}>
                <Limits itemId="item-1" itemType="numerical" />
            </CustomDataProvider>
        )

        // Expand
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
        })

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders an error message if the limits could not be loaded', async () => {
        const { getByRole, queryByRole, container } = render(
            <CustomDataProvider options={{ failOnMiss: true }}>
                <Limits itemId="item-1" itemType="numerical" />
            </CustomDataProvider>
        )

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(
            getByRole('heading', {
                name: 'There was a problem loading the limits for this data item',
            })
        ).toBeInTheDocument()
    })

    it('renders a placeholder if there are no limits', async () => {
        const mockData = {
            limits: null,
        }
        const { getByRole, queryByRole, getByText, container } = render(
            <CustomDataProvider data={mockData} options={{ failOnMiss: false }}>
                <Limits itemId="item-1" itemType="numerical" />
            </CustomDataProvider>
        )

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(
            getByText('No limits set for this data item.')
        ).toBeInTheDocument()
        expect(getByRole('button', { name: 'Add limits' })).toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Edit limits' })
        ).not.toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Delete limits' })
        ).not.toBeInTheDocument()
    })

    it('renders the item limits once loaded', async () => {
        const mockData = {
            limits: {
                avg: 3,
                min: 1,
                max: 2,
            },
        }
        const { getByRole, queryByRole, getByText, container } = render(
            <CustomDataProvider data={mockData}>
                <Limits itemId="item-1" itemType="numerical" />
            </CustomDataProvider>
        )

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(
            getByText(`Average value: ${mockData.limits.avg}`)
        ).toBeInTheDocument()
        expect(getByText(mockData.limits.min)).toBeInTheDocument()
        expect(getByText(mockData.limits.max)).toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Add limits' })
        ).not.toBeInTheDocument()
        expect(getByRole('button', { name: 'Edit limits' })).toBeInTheDocument()
        expect(
            getByRole('button', { name: 'Delete limits' })
        ).toBeInTheDocument()
    })
})
