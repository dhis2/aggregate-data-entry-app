import React from 'react'
import { render } from '../../test-utils/index.js'
import Layout from './layout.jsx'

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

    it('renders a node passed to the sidebar prop', () => {
        /**
         * This passes because even though the visibility of this
         * node can be toggled it is still in the DOM, even
         * when not visible, to allow for a (simpler) width transition.
         */

        const text = 'text'
        const { getByText } = render(<Layout sidebar={text} />)

        expect(getByText(text)).toBeInTheDocument()
    })
})
