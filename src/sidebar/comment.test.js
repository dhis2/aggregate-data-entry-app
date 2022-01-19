import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Comment from './comment.js'

describe('<Comment />', () => {
    it('renders a loading spinner whilst loading the item comment', () => {
        const { getByRole } = render(
            <CustomDataProvider options={{ loadForever: true }}>
                <Comment itemId="item-1" />
            </CustomDataProvider>
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders an error message if the comment could not be loaded', async () => {
        const { getByRole, queryByRole } = render(
            <CustomDataProvider options={{ failOnMiss: true }}>
                <Comment itemId="item-1" />
            </CustomDataProvider>
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
        await waitFor(() => {
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(
            getByRole('heading', {
                name: 'There was a problem loading the comment for this data item',
            })
        ).toBeInTheDocument()
    })

    it('renders a placeholder if there is no comment', async() => {
        const mockData = {
            comment: undefined,
        }
        const { getByRole, queryByRole, getByText } = render(
            <CustomDataProvider data={mockData} options={{ failOnMiss: false }}>
                <Comment itemId="item-1" />
            </CustomDataProvider>
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
        await waitFor(() => {
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(getByText('No comment for this data item.')).toBeInTheDocument()
        expect(
            getByRole('button', { name: 'Add comment' })
        ).toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Edit comment' })
        ).not.toBeInTheDocument()
    })

    it('renders the item comment once loaded', async () => {
        const mockData = {
            comment: 'Some comment',
        }
        const { getByRole, queryByRole, getByText } = render(
            <CustomDataProvider data={mockData}>
                <Comment itemId="item-1" />
            </CustomDataProvider>
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
        await waitFor(() => {
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(getByText(mockData.comment)).toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Add comment' })
        ).not.toBeInTheDocument()
        expect(
            getByRole('button', { name: 'Edit comment' })
        ).toBeInTheDocument()
    })
})
