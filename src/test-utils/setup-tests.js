import 'whatwg-fetch'
import { configure } from '@testing-library/dom'
import { server } from '../mocks/server.js'
import '@testing-library/jest-dom'

configure({ testIdAttribute: 'data-test' })

// Establish API mocking before all tests.
beforeAll(() =>
    server.listen({
        onUnhandledRequest: 'warn',
    })
)
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())
