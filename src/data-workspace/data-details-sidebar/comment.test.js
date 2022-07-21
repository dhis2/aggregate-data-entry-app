import { CustomDataProvider } from '@dhis2/app-runtime'
import React from 'react'
import { render } from '../../test-utils/index.js'
import Comment from './comment.js'

describe('<Comment />', () => {
    it('is expanded by default', () => {
        const { getByRole } = render(
            <CustomDataProvider>
                <Comment itemId="item-1" />
            </CustomDataProvider>
        )

        expect(getByRole('group')).toHaveAttribute('open')
    })

    it('renders a placeholder if there is no comment', () => {
        const { getByRole, queryByRole, getByText } = render(
            <CustomDataProvider>
                <Comment comment="" />
            </CustomDataProvider>
        )

        expect(getByText('No comment for this data item.')).toBeInTheDocument()
        expect(getByRole('button', { name: 'Add comment' })).toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Edit comment' })
        ).not.toBeInTheDocument()
    })

    it('renders the item comment once loaded', async () => {
        const { getByRole, queryByRole, getByText } = render(
            <CustomDataProvider>
                <Comment comment="Some comment" />
            </CustomDataProvider>
        )

        expect(getByText('Some comment')).toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Add comment' })
        ).not.toBeInTheDocument()
        expect(
            getByRole('button', { name: 'Edit comment' })
        ).toBeInTheDocument()
    })
})
