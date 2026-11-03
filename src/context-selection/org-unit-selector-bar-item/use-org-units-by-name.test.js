import { useQueries } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import useOrgUnitSearchField from './use-org-unit-search-field.js'
import useOrgUnitsByName, {
    MAX_SEARCH_RESULTS,
} from './use-org-units-by-name.js'
import useUserOrgUnits from './use-user-org-units.js'

jest.mock('@tanstack/react-query', () => ({
    useQueries: jest.fn(),
}))

jest.mock('./use-org-unit-search-field.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('./use-user-org-units.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

const fetched = (organisationUnits, total = organisationUnits.length) => ({
    isFetched: true,
    isFetching: false,
    error: null,
    data: { pager: { total }, organisationUnits },
})

const orgUnit = (id, displayName) => ({
    id,
    displayName,
    path: `/root/${id}`,
})

describe('useOrgUnitsByName', () => {
    beforeEach(() => {
        useOrgUnitSearchField.mockReturnValue({
            searchField: 'name',
            loading: false,
            error: undefined,
        })
        useUserOrgUnits.mockReturnValue({
            data: ['rootA', 'rootB'],
            loading: false,
            error: undefined,
        })
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('searches within each of the user org units', () => {
        useQueries.mockReturnValue([fetched([]), fetched([])])

        renderHook(() => useOrgUnitsByName('buma'))

        const { queries } = useQueries.mock.calls[0][0]
        expect(queries).toHaveLength(2)
        expect(queries[0].enabled).toBe(true)
        expect(queries[0].queryKey[1].params.filter).toEqual([
            'name:ilike:buma',
            'path:like:rootA',
        ])
        expect(queries[1].queryKey[1].params.filter).toEqual([
            'name:ilike:buma',
            'path:like:rootB',
        ])
        expect(queries[0].queryKey[1].params.pageSize).toBe(MAX_SEARCH_RESULTS)
    })

    it('does not search without a search term', () => {
        useQueries.mockReturnValue([])

        renderHook(() => useOrgUnitsByName(''))

        const { queries } = useQueries.mock.calls[0][0]
        expect(queries.every(({ enabled }) => !enabled)).toBe(true)
    })

    it('waits for the search field before searching', () => {
        useOrgUnitSearchField.mockReturnValue({
            searchField: 'displayName',
            loading: true,
            error: undefined,
        })
        useQueries.mockReturnValue([])

        const { result } = renderHook(() => useOrgUnitsByName('buma'))

        const { queries } = useQueries.mock.calls[0][0]
        expect(queries.every(({ enabled }) => !enabled)).toBe(true)
        expect(result.current.loading).toBe(true)
        expect(result.current.data).toBeUndefined()
    })

    it('merges, de-duplicates and sorts the results', () => {
        useQueries.mockReturnValue([
            fetched([orgUnit('c', 'Charlie'), orgUnit('a', 'Alpha')]),
            fetched([orgUnit('b', 'Bravo'), orgUnit('a', 'Alpha')]),
        ])

        const { result } = renderHook(() => useOrgUnitsByName('a'))

        expect(result.current.data).toEqual({
            orgUnits: [
                orgUnit('a', 'Alpha'),
                orgUnit('b', 'Bravo'),
                orgUnit('c', 'Charlie'),
            ],
            hasMore: false,
        })
    })

    it('indicates when there are more results than displayed', () => {
        useQueries.mockReturnValue([
            fetched([orgUnit('a', 'Alpha')], MAX_SEARCH_RESULTS + 1),
            fetched([]),
        ])

        const { result } = renderHook(() => useOrgUnitsByName('a'))

        expect(result.current.data.hasMore).toBe(true)
    })

    it('caps the merged results', () => {
        const many = (prefix) =>
            Array.from({ length: MAX_SEARCH_RESULTS }, (_, i) =>
                orgUnit(`${prefix}${i}`, `${prefix} ${i}`)
            )
        useQueries.mockReturnValue([fetched(many('a')), fetched(many('b'))])

        const { result } = renderHook(() => useOrgUnitsByName('a'))

        expect(result.current.data.orgUnits).toHaveLength(MAX_SEARCH_RESULTS)
        expect(result.current.data.hasMore).toBe(true)
    })

    it('returns the error of a failed request', () => {
        const error = new Error('network error')
        useQueries.mockReturnValue([
            fetched([]),
            { isFetched: true, isFetching: false, error, data: undefined },
        ])

        const { result } = renderHook(() => useOrgUnitsByName('a'))

        expect(result.current.error).toBe(error)
        expect(result.current.data).toBeUndefined()
    })
})
