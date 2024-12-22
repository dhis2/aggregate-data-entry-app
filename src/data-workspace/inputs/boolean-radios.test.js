import userEvent from '@testing-library/user-event'
import React from 'react'
import { useSetDataValueMutation } from '../../shared/index.js'
import { render } from '../../test-utils/render.js'
import { BooleanRadios } from './boolean-radios.js'

jest.mock('react-final-form')
jest.mock('../../shared/data-value-mutations/data-value-mutations.js')

describe('boolean-radios', () => {
    const props = {
        fieldname: 'DgnwZliJuh5.HllvX50cXC0',
        deId: 'DgnwZliJuh5',
        cocId: 'HllvX50cXC0',
        disabled: false,
        setSyncStatus: jest.fn(),
        onFocus: jest.fn(),
        onKeyDown: jest.fn(),
        onBlur: jest.fn(),
        setValueSynced: jest.fn(),
    }

    const mutate = jest.fn()

    beforeEach(() => {
        useSetDataValueMutation.mockReturnValue({
            mutate,
        })
    })

    afterEach(jest.clearAllMocks)

    it('should show Clear button if Yes is selected', () => {
        const { getByText } = render(
            <BooleanRadios {...props} initialValue={'true'} />
        )
        expect(getByText('Clear')).not.toHaveClass('hidden')
    })
    it('should show Clear button if No is selected', () => {
        const { getByText } = render(
            <BooleanRadios {...props} initialValue={'false'} />
        )
        expect(getByText('Clear')).not.toHaveClass('hidden')
    })
    it('should NOT show Clear button if nothing is selected', () => {
        const { getByText } = render(
            <BooleanRadios {...props} initialValue={''} />
        )
        expect(getByText('Clear')).toHaveClass('hidden')
    })
    it('should sync ONCE when Clear button is clicked', async () => {
        const { getByText } = render(
            <BooleanRadios {...props} initialValue={'false'} />
        )
        const clearButton = getByText('Clear')
        userEvent.click(clearButton)
        clearButton.blur() // to simulate the bug where Clear is triggered twice (once on Click, and the other on blur)

        expect(mutate).toHaveBeenCalledTimes(1)
        expect(mutate).toHaveBeenCalledWith({ value: '' }, expect.anything())
    })
})
