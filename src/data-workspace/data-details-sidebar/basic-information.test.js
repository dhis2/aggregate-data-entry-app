import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import moment from 'moment'
import React from 'react'
import BasicInformation from './basic-information.js'

const noop = () => {}

describe('<BasicInformation />', () => {
    it('renders the item name in a heading', () => {
        const item = {
            categoryOptionCombo: 'coc-1',
            comment: null,
            dataElement: 'item-1',
            name: 'Item name',
            lastUpdated: new Date().toISOString(),
            storedBy: 'Firstname Lastname',
            followup: false,
            code: '',
            value: '',
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
            categoryOptionCombo: 'coc-1',
            comment: null,
            dataElement: 'item-1',
            name: 'Item name',
            lastUpdated: new Date().toISOString(),
            storedBy: 'Firstname Lastname',
            followup: false,
            code: '',
            value: '',
        }
        const { getByText } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(
            getByText(item.dataElement, { exact: false })
        ).toBeInTheDocument()
    })

    it('renders the item code', () => {
        const item = {
            categoryOptionCombo: 'coc-1',
            comment: null,
            dataElement: 'item-1',
            name: 'Item name',
            lastUpdated: new Date().toISOString(),
            storedBy: 'Firstname Lastname',
            followup: false,
            code: 'this is the code',
            value: '',
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
            categoryOptionCombo: 'coc-1',
            comment: null,
            dataElement: 'item-1',
            name: 'Item name',
            lastUpdated: new Date().toISOString(),
            storedBy: 'Firstname Lastname',
            followup: false,
            code: 'this is the code',
            value: '',
        }

        const { getByText } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(getByText(item.storedBy, { exact: false })).toBeInTheDocument()
        expect(
            getByText(moment(item.lastUpdated).fromNow(), { exact: false })
        ).toBeInTheDocument()
    })

    it('calls the unmark followup handler', () => {
        const item = {
            categoryOptionCombo: 'coc-1',
            comment: null,
            dataElement: 'item-1',
            name: 'Item name',
            lastUpdated: new Date().toISOString(),
            storedBy: 'Firstname Lastname',
            followup: true,
            code: 'this is the code',
            value: '',
        }

        const handleUnmarkForFollowupSpy = jest.fn()
        const { getByText, getByRole } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={handleUnmarkForFollowupSpy}
            />
        )

        const markedLabel = getByText('Marked for follow-up')
        expect(markedLabel).toBeInTheDocument()

        const unmarkButton = getByRole('button', {
            name: 'Unmark for follow-up',
        })
        expect(unmarkButton).toBeInTheDocument()

        userEvent.click(unmarkButton)

        expect(handleUnmarkForFollowupSpy).toHaveBeenCalled()
    })

    it('calls the mark followup handler', () => {
        const item = {
            categoryOptionCombo: 'coc-1',
            comment: null,
            dataElement: 'item-1',
            name: 'Item name',
            lastUpdated: new Date().toISOString(),
            storedBy: 'Firstname Lastname',
            followup: false,
            code: 'this is the code',
            value: '',
        }

        const handleMarkForFollowupSpy = jest.fn()
        const { getByRole } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={handleMarkForFollowupSpy}
                onUnmarkForFollowup={noop}
            />
        )

        const markButton = getByRole('button', { name: 'Mark for follow-up' })
        expect(markButton).toBeInTheDocument()

        userEvent.click(markButton)

        expect(handleMarkForFollowupSpy).toHaveBeenCalled()
    })
})
