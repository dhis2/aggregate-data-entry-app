import { useQuery } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react-hooks'
import { useUserInfo } from './use-user-info.js'

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(() => ({})),
}))

describe('useUserInfo', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns value without modification if keyUiLocale not in data', () => {
        const mockedValue = {
            isLoading: false,
            data: { settings: { keyAnalysisDisplayProperty: false } },
        }
        useQuery.mockReturnValue(mockedValue)
        const { result } = renderHook(() => useUserInfo())
        expect(result.current).toEqual(mockedValue)
    })

    it('returns value without modification if keyUiLocale that only contains language', () => {
        const mockedValue = {
            isLoading: false,
            data: {
                settings: {
                    keyUiLocale: 'ar',
                    keyAnalysisDisplayProperty: false,
                },
            },
        }
        useQuery.mockReturnValue(mockedValue)
        const { result } = renderHook(() => useUserInfo())
        expect(result.current).toEqual(mockedValue)
    })

    it('fixes keyUiLocale that contains _', () => {
        const mockedValue = {
            isLoading: false,
            data: {
                settings: {
                    keyUiLocale: 'pt_BR',
                    keyAnalysisDisplayProperty: false,
                },
            },
        }
        const fixedValue = { ...mockedValue }
        fixedValue.data.settings.keyUiLocale = 'pt-BR'

        useQuery.mockReturnValue(mockedValue)
        const { result } = renderHook(() => useUserInfo())
        expect(result.current).toEqual(fixedValue)
    })

    it('removes script for keyUiLocale that includes script', () => {
        const mockedValue = {
            isLoading: false,
            data: {
                settings: {
                    keyUiLocale: 'uz-UZ-Cyrl',
                    keyAnalysisDisplayProperty: false,
                },
            },
        }
        const fixedValue = { ...mockedValue }
        fixedValue.data.settings.keyUiLocale = 'uz-UZ'

        useQuery.mockReturnValue(mockedValue)
        const { result } = renderHook(() => useUserInfo())
        expect(result.current).toEqual(fixedValue)
    })

    it('defaults to English if UI returns invalid type for keyUiLocale', () => {
        const mockedValue = {
            isLoading: false,
            data: {
                settings: {
                    keyUiLocale: 42,
                    keyAnalysisDisplayProperty: false,
                },
            },
        }
        const fixedValue = { ...mockedValue }
        fixedValue.data.settings.keyUiLocale = 'en'

        useQuery.mockReturnValue(mockedValue)
        const { result } = renderHook(() => useUserInfo())
        expect(result.current).toEqual(fixedValue)
    })
})
