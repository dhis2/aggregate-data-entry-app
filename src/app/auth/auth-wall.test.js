// @TODO(react testing): replace enzyme with testing-library
import { shallow } from 'enzyme'
import React from 'react'
import { ErrorMessage } from '../../shared/index.js'
import { AuthWall } from './auth-wall.js'
import { useIsAuthorized } from './use-is-authorized.js'

jest.mock('./use-is-authorized', () => ({
    useIsAuthorized: jest.fn(),
}))

afterEach(() => {
    jest.resetAllMocks()
})

describe('<AuthWall>', () => {
    it('shows a noticebox for unauthorized users', () => {
        useIsAuthorized.mockImplementation(() => false)

        const wrapper = shallow(<AuthWall>Child</AuthWall>)

        expect(wrapper.find(ErrorMessage)).toHaveLength(1)
    })

    it('renders the children for authorised users', () => {
        useIsAuthorized.mockImplementation(() => true)

        const wrapper = shallow(<AuthWall>Child</AuthWall>)

        expect(wrapper.text()).toEqual(expect.stringContaining('Child'))
    })
})
