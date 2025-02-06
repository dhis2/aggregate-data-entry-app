import { configure } from '@testing-library/dom'
import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'
import * as matchers from 'jest-extended'
expect.extend(matchers)

configure({ testIdAttribute: 'data-test' })
