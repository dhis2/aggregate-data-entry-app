import { useConfig } from '@dhis2/app-runtime'
import React from 'react'
import { render } from '../../test-utils/index.js'
import { DateText } from './date-text.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(() => ({
        systemInfo: {
            serverTimeZoneId: 'Etc/UTC',
            calendar: 'gregory',
            dateFormat: 'yyyy-mm-dd',
        },
    })),
}))

describe('DateText', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    it.each([
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'gregory',
            serverTimeZone: 'Etc/UTC',
            includeTimeZone: false,
            output: '2024-10-14 19:10',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'gregory',
            serverTimeZone: 'Etc/UTC',
            includeTimeZone: true,
            output: '2024-10-14 19:10 (UTC)',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'dd-mm-yyyy',
            calendar: 'gregory',
            serverTimeZone: 'Etc/UTC',
            includeTimeZone: false,
            output: '14-10-2024 19:10',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'dd-mm-yyyy',
            calendar: 'gregory',
            serverTimeZone: 'Etc/UTC',
            includeTimeZone: true,
            output: '14-10-2024 19:10 (UTC)',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'gregory',
            serverTimeZone: 'Asia/Vientiane',
            includeTimeZone: true,
            output: '2024-10-14 12:10 (UTC)',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'gregory',
            serverTimeZone: 'Atlantic/Cape_Verde',
            includeTimeZone: true,
            output: '2024-10-14 20:10 (UTC)',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'gregory',
            serverTimeZone: 'Etc/UTC',
            includeTimeZone: null,
            output: '2024-10-14 19:10',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'ethiopian',
            serverTimeZone: 'Etc/UTC',
            includeTimeZone: false,
            output: '2017-02-04 19:10',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'ethiopian',
            serverTimeZone: 'Africa/Addis_Ababa',
            includeTimeZone: false,
            output: '2017-02-04 16:10',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'ethiopian',
            serverTimeZone: 'Africa/Addis_Ababa',
            includeTimeZone: true,
            output: '2017-02-04 16:10 (UTC)',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'nepali',
            serverTimeZone: 'Etc/UTC',
            includeTimeZone: false,
            output: '2081-06-28 19:10',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'yyyy-mm-dd',
            calendar: 'nepali',
            serverTimeZone: 'Asia/Kathmandu',
            includeTimeZone: false,
            output: '2081-06-28 13:25',
        },
        {
            inputDate: '2024-10-14T19:10:57.836',
            dateFormat: 'dd-mm-yyyy',
            calendar: 'nepali',
            serverTimeZone: 'Asia/Kathmandu',
            includeTimeZone: false,
            output: '28-06-2081 13:25',
        },
    ])(
        'should display %s given: format is %s, calendar is %s, server time zone is %s, and includeTimeZone is %s',
        ({
            inputDate,
            dateFormat,
            calendar,
            serverTimeZone,
            includeTimeZone,
            output,
        }) => {
            useConfig.mockReturnValueOnce({
                systemInfo: {
                    serverTimeZoneId: serverTimeZone,
                    calendar,
                    dateFormat,
                },
            })
            const { getByText } = render(
                <DateText date={inputDate} includeTimeZone={includeTimeZone} />,
                { timezone: serverTimeZone }
            )
            expect(getByText(output)).toBeInTheDocument()
        }
    )
})
