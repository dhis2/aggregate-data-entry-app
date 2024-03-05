import { configure } from '@testing-library/dom'
import { configure as configureEnzyme } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'
import * as matchers from 'jest-extended'
expect.extend(matchers)

configure({ testIdAttribute: 'data-test' })
configureEnzyme({ adapter: new Adapter() })
