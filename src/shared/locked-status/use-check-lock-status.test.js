import { renderHook } from '@testing-library/react-hooks'
import { useClientServerDate } from '../date/index.js'
import { useMetadata } from '../metadata/index.js'
import {
    usePeriodId,
    useDataSetId,
    useOrgUnitId,
} from '../use-context-selection/index.js'
import { useDataValueSet } from '../use-data-value-set/use-data-value-set.js'
import { useOrgUnit } from '../use-org-unit/use-organisation-unit.js'
import { LockedStates } from './locked-states.js'
import { useCheckLockStatus } from './use-check-lock-status.js'
import { useLockedContext } from './use-locked-context.js'

jest.mock('../date/use-client-server-date.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('../metadata/use-metadata.js', () => ({
    useMetadata: jest.fn(),
}))

jest.mock('../use-context-selection/use-context-selection.js', () => ({
    useDataSetId: jest.fn(),
    useOrgUnitId: jest.fn(),
    usePeriodId: jest.fn(),
}))

jest.mock('./use-locked-context.js', () => ({
    useLockedContext: jest.fn(),
}))

jest.mock('../use-data-value-set/use-data-value-set.js', () => ({
    useDataValueSet: jest.fn(),
}))

jest.mock('../use-org-unit/use-organisation-unit.js', () => ({
    useOrgUnit: jest.fn(),
}))

describe('useCheckLockStatus', () => {
    useDataSetId.mockImplementation(() => ['dataSet1'])
    useOrgUnitId.mockImplementation(() => ['orgUnit1'])
    usePeriodId.mockImplementation(() => ['202301'])
    useOrgUnit.mockImplementation(() => ({
        data: {
            id: 'orgUnit1',
            displayName: 'Org unit 1',
            path: '/orgUnit1',
            openingDate: '2015-01-01',
            closedDate: '2023-01-18',
        },
    }))
    useMetadata.mockImplementation(() => ({
        data: {
            dataSets: {
                dataSet1: {
                    id: 'dataSet1',
                    dataInputPeriods: [
                        {
                            period: { id: '202301', name: '202301' },
                            // This defines in which time frame you're allowed
                            // to enter data for this period
                            openingDate: '2022-07-01T00:00:00.000',
                            closingDate: '2023-01-28T00:00:00.000',
                        },
                    ],
                },
            },
        },
    }))
    useDataValueSet.mockImplementation(() => ({
        loading: false,
        error: null,
        data: null,
    }))

    const setLockStatus = jest.fn()
    useLockedContext.mockImplementation(() => ({ setLockStatus }))

    afterEach(() => {
        setLockStatus.mockClear()
    })

    it('should set the lock status to LOCKED_DATA_INPUT_PERIOD', () => {
        useClientServerDate.mockImplementation(() => ({
            serverDate: new Date('2023-01-30'),
            clientDate: new Date('2023-01-30'),
        }))

        renderHook(useCheckLockStatus)

        expect(setLockStatus).toHaveBeenCalledWith(
            LockedStates.LOCKED_DATA_INPUT_PERIOD
        )
    })

    it('should set the lock status to LOCKED_ORGANISATION_UNIT', () => {
        useClientServerDate.mockImplementation(() => ({
            serverDate: new Date('2023-01-22'),
            clientDate: new Date('2023-01-22'),
        }))

        renderHook(useCheckLockStatus)

        expect(setLockStatus).toHaveBeenCalledWith(
            LockedStates.LOCKED_ORGANISATION_UNIT
        )
    })

    it('should set the lock status to OPEN', () => {
        usePeriodId.mockImplementation(() => ['202301'])

        useOrgUnit.mockImplementation(() => ({
            data: {
                id: 'orgUnit1',
                displayName: 'Org unit 1',
                path: '/orgUnit1',
                openingDate: '2015-01-01',
                closedDate: '2023-02-01',
            },
        }))

        useMetadata.mockImplementation(() => ({
            data: {
                dataSets: {
                    dataSet1: {
                        id: 'dataSet1',
                        dataInputPeriods: [
                            {
                                period: { id: '202301', name: '202301' },
                                openingDate: '2022-07-01T00:00:00.000',
                                closingDate: '2023-01-31T00:00:00.000',
                            },
                        ],
                    },
                },
            },
        }))

        useClientServerDate.mockImplementation(() => ({
            serverDate: new Date('2022-12-10'),
            clientDate: new Date('2022-12-10'),
        }))

        renderHook(useCheckLockStatus)

        expect(setLockStatus).toHaveBeenCalledWith(LockedStates.OPEN)
    })
})
