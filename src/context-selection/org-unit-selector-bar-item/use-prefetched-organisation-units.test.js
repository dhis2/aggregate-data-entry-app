import { useQueries } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react-hooks'
import useOfflineLevels from './use-offline-levels.js'
import usePrefetchedOrganisationUnits from './use-prefetched-organisation-units.js'

jest.mock('@tanstack/react-query', () => ({
    useQueries: jest.fn(),
}))

jest.mock('./use-offline-levels.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('usePrefetchedOrganisationUnits', () => {
    it('should not fetch offline units while offline levels are loading', () => {
        const useOfflineLevelsMock = jest.fn(() => ({
            offlineOrganisationUnits: undefined,
            offlineLevels: undefined,
            loading: true,
            error: undefined,
        }))
        useOfflineLevels.mockImplementationOnce(useOfflineLevelsMock)
        const useQueriesMock = jest.fn(() => [{ loading: true, data: {} }])
        useQueries.mockImplementationOnce(useQueriesMock)

        const { result } = renderHook(usePrefetchedOrganisationUnits)

        expect(result.current).toEqual({
            organisationUnits: undefined,
            offlineLevels: undefined,
            loading: true,
            error: undefined,
        })
        expect(useOfflineLevelsMock).toHaveBeenCalledTimes(1)
        expect(useQueriesMock).toHaveBeenCalledTimes(1)
        expect(useQueriesMock).toHaveBeenCalledWith({ queries: [] })
    })
    it('should fetch offline units when the offline levels are available', () => {
        const offlineLevels = {
            rootId1: [1, 2, 3],
            rootId2: [2, 3],
        }
        const useOfflineLevelsMock = jest.fn(() => ({
            offlineLevels,
            loading: false,
            error: undefined,
        }))
        useOfflineLevels.mockImplementationOnce(useOfflineLevelsMock)
        const useQueriesMock = jest.fn(() => [{ loading: true, data: {} }])
        useQueries.mockImplementationOnce(useQueriesMock)

        const { result } = renderHook(usePrefetchedOrganisationUnits)

        const args = useQueriesMock.mock.calls[0]
        const arg = args[0]

        expect(result.current).toEqual({
            offlineLevels,
            loading: false,
            error: undefined,
            offlineOrganisationUnits: [{}],
        })
        expect(useQueriesMock).toHaveBeenCalledTimes(1)
        expect(args.length).toBe(1)
        expect(arg).toEqual({
            queries: [
                {
                    enabled: true,
                    select: expect.any(Function),
                    queryKey: [
                        'organisationUnits',
                        {
                            id: 'rootId1',
                            params: {
                                fields: [
                                    'id',
                                    'displayName',
                                    'path',
                                    'children::size',
                                    'level',
                                ],
                                filter: 'level:in:[1,2,3]',
                                includeDescendants: true,
                                paging: false,
                            },
                        },
                    ],
                },
                {
                    enabled: true,
                    select: expect.any(Function),
                    queryKey: [
                        'organisationUnits',
                        {
                            id: 'rootId2',
                            params: {
                                fields: [
                                    'id',
                                    'displayName',
                                    'path',
                                    'children::size',
                                    'level',
                                ],
                                filter: 'level:in:[2,3]',
                                includeDescendants: true,
                                paging: false,
                            },
                        },
                    ],
                },
            ],
        })
    })
})
