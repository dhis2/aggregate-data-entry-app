/* eslint-disable max-params */
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
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'gregory',
            'Etc/UTC',
            false,
            '2024-10-14 19:10',
        ],
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'gregory',
            'Etc/UTC',
            true,
            '2024-10-14 19:10 (UTC)',
        ],
        [
            '2024-10-14T19:10:57.836',
            'dd-mm-yyyy',
            'gregory',
            'Etc/UTC',
            false,
            '14-10-2024 19:10',
        ],
        [
            '2024-10-14T19:10:57.836',
            'dd-mm-yyyy',
            'gregory',
            'Etc/UTC',
            true,
            '14-10-2024 19:10 (UTC)',
        ],
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'gregory',
            'Asia/Vientiane',
            true,
            '2024-10-14 12:10 (UTC)',
        ],
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'gregory',
            'Atlantic/Cape_Verde',
            true,
            '2024-10-14 20:10 (UTC)',
        ],
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'gregory',
            'Etc/UTC',
            null,
            '2024-10-14 19:10',
        ],
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'ethiopian',
            'Etc/UTC',
            false,
            '2017-02-04 19:10',
        ],
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'ethiopian',
            'Africa/Addis_Ababa',
            false,
            '2017-02-04 16:10',
        ],
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'ethiopian',
            'Africa/Addis_Ababa',
            true,
            '2017-02-04 16:10 (UTC)',
        ],
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'nepali',
            'Etc/UTC',
            false,
            '2081-06-28 19:10',
        ],
        [
            '2024-10-14T19:10:57.836',
            'yyyy-mm-dd',
            'nepali',
            'Asia/Kathmandu',
            false,
            '2081-06-28 13:25',
        ],
        [
            '2024-10-14T19:10:57.836',
            'dd-mm-yyyy',
            'nepali',
            'Asia/Kathmandu',
            false,
            '28-06-2081 13:25',
        ],
        [
            '2017-13-05T19:10:57.836',
            'yyyy-mm-dd',
            'gregory',
            'Etc/UTC',
            false,
            'Invalid date (2017-13-05T19:10:57.836)',
        ],
    ])(
        'with input of %s format is %s, calendar is %s, server time zone is %s, and includeTimeZone is %s. Should display %s',
        (
            inputDate,
            dateFormat,
            calendar,
            serverTimeZone,
            includeTimeZone,
            output
        ) => {
            useConfig.mockReturnValue({
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
