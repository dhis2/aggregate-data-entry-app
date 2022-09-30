import { configure } from '@testing-library/dom'
import { configure as configureEnzyme } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'

configure({ testIdAttribute: 'data-test' })
configureEnzyme({ adapter: new Adapter() })
