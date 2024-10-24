import { useConfig } from '@dhis2/app-runtime'
import { render as testingLibraryRender } from '@testing-library/react'
import React from 'react'
import { useLockedContext } from '../shared/locked-status/use-locked-context.js'
import { render } from '../test-utils/render.jsx'
import FormExpiryInfo from './form-expiry-info.jsx'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(() => ({
        systemInfo: { serverTimeZoneId: 'Etc/UTC', calendar: 'gregory' },
    })),
}))

jest.mock('../shared/locked-status/use-locked-context.js', () => ({
    ...jest.requireActual('../shared/locked-status/use-locked-context.js'),
    useLockedContext: jest.fn(() => ({
        locked: false,
        lockStatus: { lockDate: '2024-03-15T14:15:00' },
    })),
}))

describe('FormExpiryInfo', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-03-15T12:15:00'))
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    it('shows nothing if locked', () => {
        useLockedContext.mockImplementationOnce(() => ({
            locked: true,
            lockStatus: { lockDate: '2024-03-15T14:15:00' },
        }))
        // render without the wrapper as we just want to test this element is empty and wrapper introduces some extra divs
        const { container } = testingLibraryRender(<FormExpiryInfo />)

        expect(container).toBeEmptyDOMElement()
    })

    it('shows relative time for lockedDate, if not locked, there is a lockDate, and calendar:gregory', () => {
        const { getByText } = render(<FormExpiryInfo />)

        expect(getByText('Closes in 2 hours')).toBeInTheDocument()
    })

    it('shows relative time for lockedDate, if not locked, there is a lockDate, and calendar not gregory', () => {
        useConfig.mockImplementation(() => ({
            systemInfo: {
                calendar: 'ethiopian',
            },
        }))
        const { getByText } = render(<FormExpiryInfo />)

        expect(getByText('Closes in 2 hours')).toBeInTheDocument()
    })

    it('corrects relative time for time zone differences', () => {
        useConfig.mockImplementation(() => ({
            systemInfo: {
                serverTimeZoneId: 'America/Port-au-Prince',
                calendar: 'gregory',
            },
        }))
        const { getByText } = render(<FormExpiryInfo />)

        // current browser time: 2024-03-15T12:15:00 UTC
        // which is 2024-03-15T08:15:00 Port-au-Prince (GMT-4 due to DST)
        expect(getByText('Closes in 6 hours')).toBeInTheDocument()
    })
})
