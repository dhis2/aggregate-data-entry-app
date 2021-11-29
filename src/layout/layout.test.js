import { render } from '@testing-library/react'
import React from 'react'
import Layout from './layout.js'

describe('<Layout />', () => {
    it('renders a node passed to the header prop', () => {
        const text = 'text'
        const { getByText } = render(<Layout header={text} />)

        expect(getByText(text)).toBeInTheDocument()
    })

    it('renders a node passed to the main prop', () => {
        const text = 'text'
        const { getByText } = render(<Layout main={text} />)

        expect(getByText(text)).toBeInTheDocument()
    })
})
