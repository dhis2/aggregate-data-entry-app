import { useQueries } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import useOrgUnitSearchField from './use-org-unit-search-field.js'

jest.mock('@tanstack/react-query', () => ({
    useQueries: jest.fn(),
}))

describe('useOrgUnitSearchField', () => {
    it('requests the system and user db locale settings', () => {
        useQueries.mockReturnValueOnce([
            { isLoading: true, error: undefined, data: undefined },
            { isLoading: true, error: undefined, data: undefined },
        ])

        renderHook(useOrgUnitSearchField)

        expect(useQueries).toHaveBeenCalledWith({
            queries: [
                { queryKey: ['systemSettings/keyDbLocale', {}] },
                { queryKey: ['userSettings/keyDbLocale', {}] },
            ],
        })
    })

    it('returns "displayName" while the locale settings are loading', () => {
        useQueries.mockReturnValueOnce([
            { isLoading: true, error: undefined, data: undefined },
            { isLoading: true, error: undefined, data: undefined },
        ])

        const { result } = renderHook(useOrgUnitSearchField)

        expect(result.current).toEqual({
            searchField: 'displayName',
            loading: true,
            error: undefined,
        })
    })

    it('returns "name" when the system and user db locales match', () => {
        useQueries.mockReturnValueOnce([
            { isLoading: false, error: undefined, data: 'en' },
            { isLoading: false, error: undefined, data: 'en' },
        ])

        const { result } = renderHook(useOrgUnitSearchField)

        expect(result.current).toEqual({
            searchField: 'name',
            loading: false,
            error: undefined,
        })
    })

    it('returns "displayName" when the system and user db locales differ', () => {
        useQueries.mockReturnValueOnce([
            { isLoading: false, error: undefined, data: 'en' },
            { isLoading: false, error: undefined, data: 'fr' },
        ])

        const { result } = renderHook(useOrgUnitSearchField)

        expect(result.current).toEqual({
            searchField: 'displayName',
            loading: false,
            error: undefined,
        })
    })

    it('returns "displayName" when a locale setting request errors', () => {
        const error = new Error('network error')
        useQueries.mockReturnValueOnce([
            { isLoading: false, error, data: undefined },
            { isLoading: false, error: undefined, data: 'en' },
        ])

        const { result } = renderHook(useOrgUnitSearchField)

        expect(result.current).toEqual({
            searchField: 'displayName',
            loading: false,
            error,
        })
    })
})
