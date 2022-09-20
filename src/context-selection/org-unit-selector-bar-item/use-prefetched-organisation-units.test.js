import { useQuery } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react-hooks'
import useLoadConfigOfflineOrgUnitLevel from './use-load-config-offline-org-unit-level.js'
import useOrganisationUnitLevels from './use-organisation-unit-levels.js'
import usePrefetchedOrganisationUnits from './use-prefetched-organisation-units.js'
import useUserOrgUnits from './use-user-org-units.js'

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}))

jest.mock('./use-load-config-offline-org-unit-level.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('./use-organisation-unit-levels.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('./use-user-org-units.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

const fixtures = {
    userOrgUnits: {
        organisationUnits: [
            {
                path: '/ImspTQPwCqd',
                id: 'ImspTQPwCqd',
                level: 1,
            },
        ],
    },
    organisationUnitLevels: [
        {
            level: 1,
            displayName: 'National',
        },
        {
            level: 2,
            displayName: 'District',
        },
        {
            level: 3,
            displayName: 'Chiefdom',
        },
        {
            level: 4,
            displayName: 'Facility',
        },
    ],
    configOfflineOrgUnitLevel: {
        level: 3,
        displayName: 'Chiefdom',
    },
}

describe('usePrefetchedOrganisationUnits', () => {
    it('should not fetch offline units while userOrgUnits are loading', () => {
        const useQueryMock = jest.fn(() => ({ data: undefined }))
        useQuery.mockImplementationOnce(useQueryMock)
        useUserOrgUnits.mockReturnValueOnce({
            loading: true,
        })
        useOrganisationUnitLevels.mockReturnValueOnce({
            loading: false,
        })
        useLoadConfigOfflineOrgUnitLevel.mockReturnValueOnce({
            loading: false,
        })

        const { result } = renderHook(usePrefetchedOrganisationUnits)
        const args = useQueryMock.mock.calls[0]

        expect(result.current).toEqual({
            organisationUnits: undefined,
            offlineLevels: undefined,
            loading: true,
            error: undefined,
        })
        expect(useQueryMock).toHaveBeenCalledTimes(1)
        expect(args.length).toBe(2)
        expect(args[1]).toEqual(
            expect.objectContaining({
                enabled: false,
            })
        )
    })
    it('should not fetch offline units while organisationUnitLevels are loading', () => {
        const useQueryMock = jest.fn(() => ({ data: undefined }))
        useQuery.mockImplementationOnce(useQueryMock)
        useUserOrgUnits.mockReturnValueOnce({
            loading: false,
        })
        useOrganisationUnitLevels.mockReturnValueOnce({
            loading: true,
        })
        useLoadConfigOfflineOrgUnitLevel.mockReturnValueOnce({
            loading: false,
        })

        const { result } = renderHook(usePrefetchedOrganisationUnits)
        const args = useQueryMock.mock.calls[0]

        expect(result.current).toEqual({
            organisationUnits: undefined,
            offlineLevels: undefined,
            loading: true,
            error: undefined,
        })
        expect(useQueryMock).toHaveBeenCalledTimes(1)
        expect(args.length).toBe(2)
        expect(args[1]).toEqual(
            expect.objectContaining({
                enabled: false,
            })
        )
    })
    it('should not fetch offline units while configOfflineOrgUnitLevel are loading', () => {
        const useQueryMock = jest.fn(() => ({ data: undefined }))
        useQuery.mockImplementationOnce(useQueryMock)
        useUserOrgUnits.mockReturnValueOnce({
            loading: false,
        })
        useOrganisationUnitLevels.mockReturnValueOnce({
            loading: false,
        })
        useLoadConfigOfflineOrgUnitLevel.mockReturnValueOnce({
            loading: true,
        })

        const { result } = renderHook(usePrefetchedOrganisationUnits)
        const args = useQueryMock.mock.calls[0]

        expect(result.current).toEqual({
            organisationUnits: undefined,
            offlineLevels: undefined,
            loading: true,
            error: undefined,
        })
        expect(useQueryMock).toHaveBeenCalledTimes(1)
        expect(args.length).toBe(2)
        expect(args[1]).toEqual(
            expect.objectContaining({
                enabled: false,
            })
        )
    })
    it('should fetch offline units when the dependent queries are done loading', () => {
        const useQueryMock = jest.fn(() => ({ data: undefined }))
        useQuery.mockImplementationOnce(useQueryMock)
        useUserOrgUnits.mockReturnValueOnce({
            loading: false,
            data: fixtures.userOrgUnits,
        })
        useOrganisationUnitLevels.mockReturnValueOnce({
            loading: false,
            data: fixtures.organisationUnitLevels,
        })
        useLoadConfigOfflineOrgUnitLevel.mockReturnValueOnce({
            loading: false,
            data: fixtures.configOfflineOrgUnitLevel,
        })

        const { result } = renderHook(usePrefetchedOrganisationUnits)
        const args = useQueryMock.mock.calls[0]
        const options = args[1]
        const params = args[0][1].params

        expect(result.current).toEqual({
            organisationUnits: undefined,
            offlineLevels: 3,
            loading: false,
            error: undefined,
        })
        expect(useQueryMock).toHaveBeenCalledTimes(1)
        expect(args.length).toBe(2)
        expect(options).toEqual(
            expect.objectContaining({
                enabled: true,
            })
        )
        expect(params).toEqual({
            fields: ['id', 'displayName', 'path', 'children::size', 'level'],
            paging: false,
            filter: 'level:in:[1,2,3]',
        })
    })
})
