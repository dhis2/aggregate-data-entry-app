import { configure } from '@testing-library/dom'
import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'

configure({ testIdAttribute: 'data-test' })
