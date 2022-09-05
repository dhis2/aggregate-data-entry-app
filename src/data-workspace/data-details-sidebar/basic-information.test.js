import React from 'react'
import useHighlightedField from '../../shared/highlighted-field/use-highlighted-field.js'
import { render } from '../../test-utils/index.js'
import BasicInformation from './basic-information.js'
jest.mock('../../shared/highlighted-field/use-highlighted-field.js')

const noop = () => {}

describe('<BasicInformation />', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern')
        // set a fake time (note time zone is UTC+1 while API returns UTC)
        jest.setSystemTime(new Date('2022-06-28T15:52+01:00').getTime())

        useHighlightedField.mockReturnValue({
            value: '1',
        })
    })
    afterEach(() => {
        jest.useRealTimers()
    })
    it('renders the item name in a heading', () => {
        const item = {
            categoryOptionCombo: 'coc-1',
            comment: null,
            dataElement: 'item-1',
            name: 'Item name',
            lastUpdated: '2022-06-28T14:51:14.435',
            storedBy: 'Firstname Lastname',
            followUp: false,
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
            lastUpdated: '2022-06-28T14:51:14.435',
            storedBy: 'Firstname Lastname',
            followUp: false,
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
            lastUpdated: '2022-06-28T14:51:14.435',
            storedBy: 'Firstname Lastname',
            followUp: false,
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
            lastUpdated: '2022-06-28T14:51:14.435',
            storedBy: 'Firstname Lastname',
            followUp: false,
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
        expect(getByText('a minute ago', { exact: false })).toBeInTheDocument()
    })
})
