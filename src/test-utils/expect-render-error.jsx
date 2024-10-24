import { PropTypes } from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'

/**
 * Taken from the gist referenced here: https://github.com/facebook/react/issues/11098#issuecomment-412682721
 * This module allows asserting component render errors, and prevents them from
 * showing up in the console.
 */

// Noop error boundary for testing.
class TestBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { didError: false }
    }

    componentDidCatch() {
        this.setState({ didError: true })
    }

    render() {
        return this.state.didError ? null : this.props.children
    }
}

TestBoundary.propTypes = {
    children: PropTypes.node.isRequired,
}

// Assertion
const expectRenderError = (element, expectedError) => {
    // Record all errors.
    const topLevelErrors = []

    function handleTopLevelError(event) {
        topLevelErrors.push(event.error)

        // Prevent logging
        event.preventDefault()
    }

    const div = document.createElement('div')
    window.addEventListener('error', handleTopLevelError)

    try {
        ReactDOM.render(<TestBoundary>{element}</TestBoundary>, div)
    } finally {
        window.removeEventListener('error', handleTopLevelError)
    }

    expect(topLevelErrors.length).toBe(1)
    expect(topLevelErrors[0].message).toContain(expectedError)
}

export { expectRenderError }
