import { useConfig } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react-hooks'
import { useMetadata } from '../metadata/use-metadata.js'
import { usePeriod } from '../period/index.js'
import { useDataValueSet } from '../use-data-value-set/use-data-value-set.js'
import { useOrgUnit } from '../use-org-unit/use-organisation-unit.js'
import { useUserInfo } from '../use-user-info/use-user-info.js'
import { useCheckLockStatus } from './use-check-lock-status.js'
import * as useLockedContextModule from './use-locked-context.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(() => ({
        systemInfo: { serverTimeZoneId: 'Etc/UTC', calendar: 'gregory' },
    })),
}))

jest.mock('../use-context-selection/use-context-selection.js', () => ({
    ...jest.requireActual('../use-context-selection/use-context-selection.js'),
    useDataSetId: jest.fn(() => ['data-set-id']),
    usePeriodId: jest.fn(() => ['period-id']),
}))

jest.mock('../use-org-unit/use-organisation-unit.js', () => ({
    ...jest.requireActual('../use-org-unit/use-organisation-unit.js'),
    useOrgUnit: jest.fn(() => ({
        data: {
            openingDate: '1970-01-01',
            closedDate: '2070-01-01',
        },
    })),
}))

jest.mock('../period/index.js', () => ({
    ...jest.requireActual('../period/index.js'),
    usePeriod: jest.fn(() => ({
        id: 'period-id',
        startDate: '2023-04-01',
        endDate: '2023-04-30',
    })),
}))

jest.mock('../metadata/use-metadata.js', () => ({
    ...jest.requireActual('../metadata/use-metadata.js'),
    useMetadata: jest.fn(() => ({
        data: {
            dataSets: {
                'data-set-id': {
                    id: 'data-set-id',
                    expiryDays: 10,
                    dataInputPeriods: [],
                },
            },
        },
    })),
}))

jest.mock('../use-data-value-set/use-data-value-set.js', () => ({
    ...jest.requireActual('../use-data-value-set/use-data-value-set.js'),
    useDataValueSet: jest.fn(() => ({ data: { lockStatus: null } })),
}))

jest.mock('../use-user-info/use-user-info.js', () => ({
    ...jest.requireActual('../use-user-info/use-user-info.js'),
    useUserInfo: jest.fn(() => ({ data: { authorities: ['ALL'] } })),
}))

describe('useCheckLockStatus', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.useRealTimers()
    })

    it('uses backend status if available', () => {
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        useDataValueSet.mockImplementationOnce(() => ({
            data: {
                lockStatus: 'LOCKED',
            },
        }))
        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            state: 'Locked_expiry_days',
        })
    })

    it('locks if org unit opens after period starts', () => {
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        useOrgUnit.mockImplementationOnce(() => ({
            data: {
                openingDate: '2024-01-03',
            },
        }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            state: 'Locked_organisation_unit',
        })
    })

    it('locks if org unit closes before period ends', () => {
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        useOrgUnit.mockImplementationOnce(() => ({
            data: {
                closedDate: '2024-01-28',
            },
        }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            state: 'Locked_organisation_unit',
        })
    })

    it('locks if org unit closes before period ends (ethiopian calendar)', () => {
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        useConfig.mockImplementationOnce(() => ({
            systemInfo: { calendar: 'ethiopian', serverTimeZoneId: 'Etc/UTC' },
        }))
        useOrgUnit.mockImplementationOnce(() => ({
            data: {
                closedDate: '2016-13-03',
            },
        }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2016-13-01',
            endDate: '2017-01-02',
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            state: 'Locked_organisation_unit',
        })
    })

    it('locks for data input period if there are data input periods, but none for the selected period', () => {
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    'data-set-id': {
                        id: 'data-set-id',
                        expiryDays: 10,
                        dataInputPeriods: [
                            {
                                period: {
                                    id: 'another-period-id',
                                },
                                openingDate: '2025-01-01T00:00:00',
                                closingDate: '2025-01-31T00:00:00',
                            },
                        ],
                    },
                },
            },
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            lockDate: null,
            state: 'Locked_data_input_period',
        })
    })

    it('locks for data input period if browser date/time is not within data input period', () => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2026-10-15'))
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    'data-set-id': {
                        id: 'data-set-id',
                        expiryDays: 10,
                        dataInputPeriods: [
                            {
                                period: {
                                    id: 'period-id',
                                },
                                openingDate: '2025-01-01T00:00:00',
                                closingDate: '2025-01-31T00:00:00',
                            },
                        ],
                    },
                },
            },
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            lockDate: null,
            state: 'Locked_data_input_period',
        })
    })

    it('locks for data input period if browser date/time is not within data input period (time zone adjustment)', () => {
        // system time is 30 Jan 23:00 UTC, server is in Kampala (UTC+3), so 31 Jan 02:00
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2025-01-30T23:00:00'))
        useConfig.mockImplementationOnce(() => ({
            systemInfo: {
                calendar: 'gregory',
                serverTimeZoneId: 'Africa/Kampala',
            },
        }))
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    'data-set-id': {
                        id: 'data-set-id',
                        expiryDays: 10,
                        dataInputPeriods: [
                            {
                                period: {
                                    id: 'period-id',
                                },
                                openingDate: '2025-01-01T00:00:00',
                                closingDate: '2025-01-31T00:00:00',
                            },
                        ],
                    },
                },
            },
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            lockDate: null,
            state: 'Locked_data_input_period',
        })
    })

    it('does not lock for data input period if browser date/time is within data input period', () => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2025-01-15'))
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    'data-set-id': {
                        id: 'data-set-id',
                        expiryDays: 10,
                        dataInputPeriods: [
                            {
                                period: {
                                    id: 'period-id',
                                },
                                openingDate: '2025-01-01T00:00:00',
                                closingDate: '2025-01-31T00:00:00',
                            },
                        ],
                    },
                },
            },
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            lockDate: '2025-01-31T00:00:00',
            state: 'Open',
        })
    })

    it('does not lock for data input period if browser date/time is within data input period', () => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2025-01-15'))
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    'data-set-id': {
                        id: 'data-set-id',
                        expiryDays: 10,
                        dataInputPeriods: [
                            {
                                period: {
                                    id: 'period-id',
                                },
                                openingDate: '2025-01-01T00:00:00',
                                closingDate: '2025-01-31T00:00:00',
                            },
                        ],
                    },
                },
            },
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            lockDate: '2025-01-31T00:00:00',
            state: 'Open',
        })
    })

    it('sets a lock date, accounting for expiry days (if releveant), but leaves form open', () => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-02-04'))
        useUserInfo.mockImplementationOnce(() => ({
            data: { authorities: [] },
        }))
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    'data-set-id': {
                        id: 'data-set-id',
                        expiryDays: 10,
                        dataInputPeriods: [],
                    },
                },
            },
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            lockDate: '2024-02-11',
            state: 'Open',
        })
    })

    it('sets end of data input period as lock date if less than period end + expiry days', () => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-02-04'))
        useUserInfo.mockImplementationOnce(() => ({
            data: { authorities: [] },
        }))
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    'data-set-id': {
                        id: 'data-set-id',
                        expiryDays: 90,
                        dataInputPeriods: [
                            {
                                period: {
                                    id: 'period-id',
                                },
                                openingDate: '2024-02-01T00:00:00',
                                closingDate: '2024-02-29T00:00:00',
                            },
                        ],
                    },
                },
            },
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            lockDate: '2024-02-29T00:00:00',
            state: 'Open',
        })
    })

    it('does not warn about expiry days if user has authority to edit expired periods', () => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-02-04'))
        useUserInfo.mockImplementationOnce(() => ({
            data: { authorities: ['F_EDIT_EXPIRED'] },
        }))
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    'data-set-id': {
                        id: 'data-set-id',
                        expiryDays: 90,
                        dataInputPeriods: [],
                    },
                },
            },
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            lockDate: null,
            state: 'Open',
        })
    })

    // this test confirms that we do not have functionality to add days to non-gregory days
    // i.e., we'd like this test to fail eventually when we add ability to add days to non-gregory dates
    it('does not set lockDate based on expiry days if calendar is non-gregory ', () => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-02-04'))
        useConfig.mockImplementationOnce(() => ({
            systemInfo: { calendar: 'ethiopian', serverTimeZoneId: 'Etc/UTC' },
        }))
        const setLockedStatusMocked = jest.fn()
        jest.spyOn(
            useLockedContextModule,
            'useLockedContext'
        ).mockImplementation(() => ({ setLockStatus: setLockedStatusMocked }))
        usePeriod.mockImplementationOnce(() => ({
            id: 'period-id',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        }))
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    'data-set-id': {
                        id: 'data-set-id',
                        expiryDays: 10,
                        dataInputPeriods: [],
                    },
                },
            },
        }))

        renderHook(() => useCheckLockStatus())
        expect(setLockedStatusMocked).toHaveBeenCalledWith({
            lockDate: null,
            state: 'Open',
        })
    })
})
