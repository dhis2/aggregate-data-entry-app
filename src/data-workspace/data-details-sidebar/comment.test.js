import { fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import {
    useMetadata,
    useSetDataValueMutation,
    useCanUserEditFields,
} from '../../shared/index.js'
import { render } from '../../test-utils/index.js'
import Comment from './comment.js'

jest.mock('../../shared/data-value-mutations/data-value-mutations.js', () => ({
    useSetDataValueMutation: jest.fn(() => ({})),
}))

jest.mock('../../shared/metadata/use-metadata.js', () => ({
    useMetadata: jest.fn(() => ({})),
}))

jest.mock('../../shared/use-user-info/use-can-user-edit-fields.js', () => ({
    __esModule: true,
    default: jest.fn(() => true),
}))

describe('<Comment />', () => {
    afterEach(() => {
        useSetDataValueMutation.mockClear()
    })

    const mockSetDataValueMutation = (mockError = false) => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        useSetDataValueMutation.mockImplementation(() => {
            const [error, setError] = useState(false)
            const [loading, setLoading] = useState(false)
            return {
                isLoading: loading,
                isError: error,
                mutateAsync: async () => {
                    if (!mockError) {
                        setLoading(true)
                        setLoading(false)
                        return Promise.resolve()
                    } else {
                        setLoading(true)
                        setLoading(false)
                        setError(true)
                        return Promise.reject()
                    }
                },
            }
        })
    }

    const mockSetDataValueMutationError = () => mockSetDataValueMutation(true)

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
        mockSetDataValueMutation()

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

    it('shows a drop down with relevant options when data element has a commentOptionSet', async () => {
        useMetadata.mockImplementation(() => ({
            data: {
                optionSets: {
                    optSet1: {
                        options: [
                            { id: 'opt1', code: 'OPT1', displayName: 'Ole' },
                            { id: 'opt2', code: 'OPT2', displayName: 'Dole' },
                            { id: 'opt3', code: 'OPT3', displayName: 'Doffen' },
                        ],
                    },
                },
            },
        }))

        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            commentOptionSetId: 'optSet1',
        }

        const { getByRole, getByText, queryByRole } = render(
            <Comment item={item} />
        )

        userEvent.click(getByRole('button', { name: 'Add comment' }))

        await waitFor(() => {
            expect(queryByRole('textbox')).toBeInTheDocument()
        })

        userEvent.click(getByText('Choose an option'))

        await waitFor(() => {
            expect(getByText('Doffen')).toBeInTheDocument()
        })
    })

    it('sets the comment text to selected option if there is an option set and user selects an option ', async () => {
        useMetadata.mockImplementation(() => ({
            data: {
                optionSets: {
                    optSet1: {
                        options: [
                            { id: 'opt1', code: 'OPT1', displayName: 'Ole' },
                            { id: 'opt2', code: 'OPT2', displayName: 'Dole' },
                            { id: 'opt3', code: 'OPT3', displayName: 'Doffen' },
                        ],
                    },
                },
            },
        }))

        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            commentOptionSetId: 'optSet1',
            comment: 'an existing comment not about donald duck',
        }

        const { getByRole, getByText, queryByRole } = render(
            <Comment item={item} />
        )

        userEvent.click(getByRole('button', { name: 'Edit comment' }))

        await waitFor(() => {
            expect(queryByRole('textbox')).toBeInTheDocument()
        })

        userEvent.click(getByText('Choose an option'))
        userEvent.click(getByText('Doffen'))

        expect(getByRole('textbox').value).toBe('Doffen')
    })

    it('shows a the error message when submitting a comment fails', async () => {
        mockSetDataValueMutationError()

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
                name: 'There was a problem updating the comment for this data item',
            })
        ).not.toBeInTheDocument()

        userEvent.click(getByRole('button', { name: 'Save comment' }))
        expect(
            getByRole('heading', {
                name: 'There was a problem updating the comment for this data item',
            })
        ).toBeInTheDocument()
    })

    it('should show the comment as text when done editing', async () => {
        mockSetDataValueMutation()
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
            expect(editButton).toBeInTheDocument()
            expect(saveButton).not.toBeInTheDocument()
        })
    })

    it('should show unsaved comment when going back to cell with unsaved comment', async () => {
        const firstItem = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: 'original comment',
        }

        const secondItem = {
            categoryOptionCombo: 'coc-id-2',
            dataElement: 'de-id-2',
            comment: 'second item comment',
        }

        const changedComment = 'changed comment'

        // show first item
        const { getByRole, getByText, rerender, findByText } = render(
            <Comment item={firstItem} />
        )

        // change the comment
        userEvent.click(getByRole('button', { name: 'Edit comment' }))
        const input = getByRole('textbox')
        fireEvent.change(input, {
            target: { value: changedComment },
        })

        fireEvent.blur(input)

        // show second item
        rerender(<Comment item={secondItem} />)
        await findByText('second item comment')

        // go back to first item
        rerender(<Comment item={firstItem} />)

        // it should show the changed unsaved text
        await findByText(changedComment)

        // when canceling, it should revert to original text
        userEvent.click(getByText('Cancel'))
        await findByText('original comment')
    })

    it('should show unsaved comment if saving failed', async () => {
        mockSetDataValueMutationError()

        const firstItem = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: 'original comment',
        }

        const secondItem = {
            categoryOptionCombo: 'coc-id-2',
            dataElement: 'de-id-2',
            comment: 'second item comment',
        }

        const changedComment = 'changed comment'

        // show first item
        const { getByRole, getByText, rerender, findByText, findByRole } =
            render(<Comment item={firstItem} />)

        // change the comment
        userEvent.click(getByRole('button', { name: 'Edit comment' }))
        const input = getByRole('textbox')
        fireEvent.change(input, {
            target: { value: changedComment },
        })

        fireEvent.blur(input)

        userEvent.click(getByRole('button', { name: 'Save comment' }))

        expect(
            await findByRole('heading', {
                name: 'There was a problem updating the comment for this data item',
            })
        ).toBeInTheDocument()

        // show second item
        rerender(<Comment item={secondItem} />)
        await findByText('second item comment')

        // go back to first item
        rerender(<Comment item={firstItem} />)

        // it should show the changed unsaved text
        await findByText(changedComment)

        // when canceling, it should revert to original text
        userEvent.click(getByText('Cancel'))
        await findByText('original comment')
    })

    it('should not allow adding a comment when the user does not have the required authority', () => {
        useCanUserEditFields.mockImplementation(() => false)

        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: '',
        }

        const { getByRole } = render(<Comment item={item} />)

        expect(getByRole('button', { name: 'Add comment' })).toHaveAttribute(
            'disabled'
        )
    })

    it('should not allow editing a comment when the user does not have the required authority', () => {
        useCanUserEditFields.mockImplementation(() => false)

        const item = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: 'This is a comment',
        }

        const { getByRole } = render(<Comment item={item} />)

        expect(getByRole('button', { name: 'Edit comment' })).toHaveAttribute(
            'disabled'
        )
    })
})
