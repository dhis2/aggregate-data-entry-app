import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import moment from 'moment'
import React from 'react'
import BasicInformation from './basic-information.js'

const noop = () => {}

describe('<BasicInformation />', () => {
    it('renders the item name in a heading', () => {
        const item = {
            id: 'item-1',
            name: 'Item name',
            code: 'item-code',
            lastUpdated: {
                at: new Date(),
                userDisplayName: 'Firstname Lastname',
            },
            markedForFollowup: false,
        }
        const { getByRole } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(getByRole('heading', { name: item.name })).toBeInTheDocument()
    })

    it('renders the item ID', () => {
        const item = {
            id: 'item-1',
            name: 'Item name',
            code: 'item-code',
            lastUpdated: {
                at: new Date(),
                userDisplayName: 'Firstname Lastname',
            },
            markedForFollowup: false,
        }
        const { getByText } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(getByText(item.id, { exact: false })).toBeInTheDocument()
    })

    it('renders the item code', () => {
        const item = {
            id: 'item-1',
            name: 'Item name',
            code: 'item-code',
            lastUpdated: {
                at: new Date(),
                userDisplayName: 'Firstname Lastname',
            },
            markedForFollowup: false,
        }
        const { getByText } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(getByText(item.code, { exact: false })).toBeInTheDocument()
    })

    it('renders when the item was last updated as well as who updated it', () => {
        const item = {
            id: 'item-1',
            name: 'Item name',
            code: 'item-code',
            lastUpdated: {
                at: new Date(),
                userDisplayName: 'Firstname Lastname',
            },
            markedForFollowup: false,
        }
        const { getByText } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(
            getByText(item.lastUpdated.userDisplayName, { exact: false })
        ).toBeInTheDocument()
        expect(
            getByText(moment(item.lastUpdated.at).fromNow(), { exact: false })
        ).toBeInTheDocument()
    })

    it('renders a message if the item is marked for follow-up', () => {
        const item = {
            id: 'item-1',
            name: 'Item name',
            code: 'item-code',
            lastUpdated: {
                at: new Date(),
                userDisplayName: 'Firstname Lastname',
            },
            markedForFollowup: true,
        }
        const handleUnmarkForFollowupSpy = jest.fn()
        const { getByText, queryByText, getByRole, queryByRole, rerender } =
            render(
                <BasicInformation
                    item={item}
                    onMarkForFollowup={noop}
                    onUnmarkForFollowup={handleUnmarkForFollowupSpy}
                />
            )

        expect(getByText('Marked for follow-up')).toBeInTheDocument()
        expect(
            getByRole('button', { name: 'Unmark for follow-up' })
        ).toBeInTheDocument()
        userEvent.click(getByRole('button', { name: 'Unmark for follow-up' }))
        expect(handleUnmarkForFollowupSpy).toHaveBeenCalled()
        expect(
            queryByRole('button', { name: 'Mark for follow-up' })
        ).not.toBeInTheDocument()

        const item2 = {
            ...item,
            markedForFollowup: false,
        }
        const handleMarkForFollowupSpy = jest.fn()
        rerender(
            <BasicInformation
                item={item2}
                onMarkForFollowup={handleMarkForFollowupSpy}
                onUnmarkForFollowup={noop}
            />
        )

        expect(queryByText('Marked for follow-up')).not.toBeInTheDocument()
        expect(
            queryByRole('button', { name: 'Unmark for follow-up' })
        ).not.toBeInTheDocument()
        expect(
            getByRole('button', { name: 'Mark for follow-up' })
        ).toBeInTheDocument()
        userEvent.click(getByRole('button', { name: 'Mark for follow-up' }))
        expect(handleMarkForFollowupSpy).toHaveBeenCalled()
    })
})
