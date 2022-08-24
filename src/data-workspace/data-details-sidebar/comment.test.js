import { fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import { render } from '../../test-utils/index.js'
import { useSetDataValueMutation } from '../data-value-mutations/index.js'
import Comment from './comment.js'

jest.mock('../data-value-mutations/index.js', () => ({
    useSetDataValueMutation: jest.fn(() => ({})),
}))

describe('<Comment />', () => {
    afterEach(() => {
        useSetDataValueMutation.mockClear()
    })

    it('is expanded by default', () => {
        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: '',
        }

        const { getByRole } = render(<Comment item={item} />)
        expect(getByRole('button', { name: 'Add comment' })).toBeInTheDocument()
    })

    it('renders a placeholder if there is no comment', () => {
        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: '',
        }

        const { getByRole, queryByRole, getByText } = render(
            <Comment item={item} />
        )

        expect(getByText('No comment for this data item.')).toBeInTheDocument()
        expect(getByRole('button', { name: 'Add comment' })).toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Edit comment' })
        ).not.toBeInTheDocument()
    })

    it('renders the item comment', async () => {
        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: 'This is a comment',
        }

        const { getByRole, queryByRole, getByText } = render(
            <Comment item={item} />
        )

        expect(getByText('This is a comment')).toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Add comment' })
        ).not.toBeInTheDocument()
        expect(
            getByRole('button', { name: 'Edit comment' })
        ).toBeInTheDocument()
    })

    it('shows a loading indicator when submitting a comment change', async () => {
        useSetDataValueMutation.mockImplementation(() => {
            const [loading, setLoading] = useState(false)
            return {
                isLoading: loading,
                mutate: () => setLoading(true),
            }
        })

        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: 'This is a comment',
        }

        const { getByRole, queryByRole } = render(<Comment item={item} />)

        userEvent.click(getByRole('button', { name: 'Edit comment' }))

        await waitFor(() => {
            expect(queryByRole('textbox')).toBeInTheDocument()
        })

        const input = getByRole('textbox')
        fireEvent.change(input, {
            target: { value: 'Changed' },
        })
        expect(input.value).toBe('Changed')

        expect(queryByRole('progressbar')).not.toBeInTheDocument()
        userEvent.click(getByRole('button', { name: 'Save comment' }))
        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    it('shows a the error message when submitting a comment fails', async () => {
        useSetDataValueMutation.mockImplementation(() => {
            const [error, setError] = useState(false)
            return {
                isLoading: false,
                isError: error,
                mutate: () => setError(true),
            }
        })

        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: 'This is a comment',
        }

        const { getByRole, queryByRole } = render(<Comment item={item} />)

        userEvent.click(getByRole('button', { name: 'Edit comment' }))
        await waitFor(() => {
            expect(getByRole('textbox')).toBeInTheDocument()
        })

        const input = getByRole('textbox')
        fireEvent.change(input, {
            target: { value: 'Changed' },
        })
        expect(input.value).toBe('Changed')

        expect(
            queryByRole('heading', {
                name: 'There was a problem loading the comment for this data item',
            })
        ).not.toBeInTheDocument()

        userEvent.click(getByRole('button', { name: 'Save comment' }))
        expect(
            getByRole('heading', {
                name: 'There was a problem loading the comment for this data item',
            })
        ).toBeInTheDocument()
    })

    it('should show the comment as text when done editing', async () => {
        useSetDataValueMutation.mockImplementation(() => {
            return {
                mutate: (_, { onSuccess }) => {
                    // fire after returning
                    setTimeout(onSuccess, 0)
                    return Promise.resolve()
                },
            }
        })

        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: 'This is a comment',
        }

        const { getByRole, queryByRole } = render(<Comment item={item} />)

        userEvent.click(getByRole('button', { name: 'Edit comment' }))
        await waitFor(() => {
            expect(getByRole('textbox')).toBeInTheDocument()
        })

        const input = getByRole('textbox')
        fireEvent.change(input, {
            target: { value: 'Changed' },
        })
        expect(input.value).toBe('Changed')

        expect(
            queryByRole('heading', {
                name: 'There was a problem loading the comment for this data item',
            })
        ).not.toBeInTheDocument()

        userEvent.click(getByRole('button', { name: 'Save comment' }))
        await waitFor(() => {
            const saveButton = queryByRole('button', { name: 'Save comment' })
            const editButton = queryByRole('button', { name: 'Edit comment' })
            expect(saveButton).not.toBeInTheDocument()
            expect(editButton).toBeInTheDocument()
        })
    })
})
