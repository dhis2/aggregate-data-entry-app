import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Title from './title.js'

describe('<Title />', () => {
    it('renders a close button', () => {
        const handleCloseSpy = jest.fn()
        const { getByRole } = render(
            <Title onClose={handleCloseSpy}>Test title</Title>
        )

        expect(getByRole('button')).toBeInTheDocument()
        userEvent.click(getByRole('button'))
        expect(handleCloseSpy).toHaveBeenCalled()
    })
})
