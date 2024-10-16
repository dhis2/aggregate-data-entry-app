import { useConfig } from '@dhis2/app-runtime'
import React from 'react'
import useHighlightedField from '../../shared/highlighted-field/use-highlighted-field.js'
import { render } from '../../test-utils/index.js'
import BasicInformation from './basic-information.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(() => ({
        systemInfo: { serverTimeZoneId: 'Etc/UTC', calendar: 'gregory' },
    })),
}))

jest.mock('../../shared/highlighted-field/use-highlighted-field.js')

const noop = () => {}

const item = {
    categoryOptionCombo: 'coc-1',
    comment: null,
    dataElement: 'item-1',
    name: 'Item name',
    lastUpdated: '2022-06-28T14:51:14.435',
    storedBy: 'Firstname Lastname',
    followUp: false,
    code: 'this-is-the-code',
    value: '',
    displayFormName: 'Item name (form)',
}

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
        jest.clearAllMocks()
    })

    it('renders the item name in a heading', () => {
        const { getByRole } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(
            getByRole('heading', { name: item.displayFormName })
        ).toBeInTheDocument()
    })

    it('renders the item ID', () => {
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

    it('renders relative time with non-gregory calendar', () => {
        useConfig.mockImplementation(() => ({
            systemInfo: {
                serverTimeZoneId: 'Africa/Abidjan',
                calendar: 'nepali',
            },
        }))

        const { getByText } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(getByText(item.storedBy, { exact: false })).toBeInTheDocument()
        expect(
            getByText('a minute ago', {
                exact: false,
            })
        ).toBeInTheDocument()
    })

    it('renders the item description if one is provided', () => {
        const description = 'this is the very helpful description'
        const itemWithDescription = {
            ...item,
            description,
        }

        const { getByText } = render(
            <BasicInformation
                item={itemWithDescription}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(getByText(description, { exact: false })).toBeInTheDocument()
    })

    it('does NOT render a description line if description is not provided', () => {
        const { queryByText } = render(
            <BasicInformation
                item={item}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(
            queryByText('Description:', { exact: false })
        ).not.toBeInTheDocument()
    })

    it('flags field as "Marked for follow-up" when followUp is set to true', () => {
        const { getByText } = render(
            <BasicInformation
                item={{ ...item, followUp: true }}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(getByText('Marked for follow-up')).toBeInTheDocument()
    })

    it('does NOT flag field as "Marked for follow-up" when followUp is set to false', () => {
        const { queryByText } = render(
            <BasicInformation
                item={{ ...item, followUp: false }}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(queryByText('Marked for follow-up')).not.toBeInTheDocument()
    })

    it('does NOT flag field as "Marked for follow-up" when followUp is set to false', () => {
        const { queryByText } = render(
            <BasicInformation
                item={{ ...item, followUp: false }}
                onMarkForFollowup={noop}
                onUnmarkForFollowup={noop}
            />
        )

        expect(queryByText('Mark for follow-up')).toBeInTheDocument()
    })
})
