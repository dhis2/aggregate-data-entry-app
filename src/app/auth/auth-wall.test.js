import React from 'react'
import { render } from '../../test-utils/index.js'
import AuthWall from './auth-wall.js'

describe('<AuthWall />', () => {
    it('shows an error message for unauthorized users', () => {
        const children = 'children'
        const { queryByText, getByText } = render(
            <AuthWall isAuthorized={false}>{children}</AuthWall>
        )
        const errorTitle = 'Not authorized'
        const errorMessage =
            "You don't have access to the Data Approval App. Contact a system administrator to request access."

        expect(queryByText(children)).not.toBeInTheDocument()
        expect(getByText(errorTitle)).toBeInTheDocument()
        expect(getByText(errorMessage)).toBeInTheDocument()
    })

    it('renders the children for authorised users', () => {
        const children = 'children'
        const { getByText } = render(
            <AuthWall isAuthorized={true}>{children}</AuthWall>
        )

        expect(getByText(children)).toBeInTheDocument()
    })
})
