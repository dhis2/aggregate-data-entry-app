import { configure } from '@testing-library/dom'
import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'
import * as matchers from 'jest-extended'
expect.extend(matchers)

configure({ testIdAttribute: 'data-test' })

const origError = console.error

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        const [err] = args

        // ToDo: remove this once our UI library is updated to not use defaultProps
        if (!err.toString().match(/Support for defaultProps will be removed/)) {
            origError(...args)
        }
    })
})
