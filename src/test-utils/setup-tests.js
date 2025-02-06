import { configure } from '@testing-library/dom'
import { configure as configureEnzyme } from 'enzyme'
import Adapter from '@cfaester/enzyme-adapter-react-18'
import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'
import * as matchers from 'jest-extended'
expect.extend(matchers)

configure({ testIdAttribute: 'data-test' })
configureEnzyme({ adapter: new Adapter() })
