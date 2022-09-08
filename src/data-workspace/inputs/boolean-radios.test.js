import userEvent from '@testing-library/user-event'
import React from 'react'
import { useField } from 'react-final-form'
import { useSetDataValueMutation } from '../../shared/index.js'
import { render } from '../../test-utils/render.js'
import { BooleanRadios } from './boolean-radios.js'

jest.mock('react-final-form')
jest.mock('../data-value-mutations/data-value-mutations.js')

describe('boolean-radios', () => {
    const props = {
        fieldname: 'DgnwZliJuh5.HllvX50cXC0',
        deId: 'DgnwZliJuh5',
        cocId: 'HllvX50cXC0',
        disabled: false,
        setSyncStatus: jest.fn(),
        onFocus: jest.fn(),
        onKeyDown: jest.fn(),
    }

    const mutate = jest.fn()

    const mockUseField = (value) => {
        useField.mockImplementation(() => {
            return {
                input: {
                    name: 'DgnwZliJuh5.HllvX50cXC0',
                    value,
                    onFocus: jest.fn(),
                    onChange: jest.fn(),
                    onBlur: jest.fn(),
                },
                meta: {
                    active: false,
                    data: {},
                    dirty: true,
                    dirtySinceLastSubmit: false,
                    initial: '',
                    invalid: false,
                    modified: true,
                    modifiedSinceLastSubmit: false,
                    pristine: true,
                    submitFailed: false,
                    submitSucceeded: false,
                    submitting: false,
                    touched: true,
                    valid: true,
                    validating: false,
                    visited: true,
                },
            }
        })
    }
    beforeEach(() => {
        useSetDataValueMutation.mockReturnValue({
            mutate,
        })
    })

    afterEach(jest.clearAllMocks)

    it('should show Clear button if Yes is selected', () => {
        mockUseField('true')
        const { getByText } = render(<BooleanRadios {...props} />)
        expect(getByText('Clear')).not.toHaveClass('hidden')
    })
    it('should show Clear button if No is selected', () => {
        mockUseField('false')
        const { getByText } = render(<BooleanRadios {...props} />)
        expect(getByText('Clear')).not.toHaveClass('hidden')
    })
    it('should NOT show Clear button if nothing is selected', () => {
        mockUseField('')
        const { getByText } = render(<BooleanRadios {...props} />)
        expect(getByText('Clear')).toHaveClass('hidden')
    })
    it('should sync ONCE when Clear button is clicked', async () => {
        mockUseField('false')
        const { getByText } = render(<BooleanRadios {...props} />)
        const clearButton = getByText('Clear')
        userEvent.click(clearButton)
        clearButton.blur() // to simulate the bug where Clear is triggered twice (once on Click, and the other on blur)

        expect(mutate).toHaveBeenCalledTimes(1)
        expect(mutate).toHaveBeenCalledWith({ value: '' }, expect.anything())
    })
})
