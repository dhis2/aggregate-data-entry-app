import { useConfig } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react-hooks'
import { useFeatureToggleContext } from './use-feature-toggle-context.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(),
}))

describe('useFeatureToggle', () => {
    it.each([
        [true, { major: 2, minor: 43, patch: undefined }],
        [true, { major: 2, minor: 43, patch: 0 }],
        [true, { major: 2, minor: 43, patch: 3 }],
        [true, { major: 2, minor: 42, patch: 1 }],
        [false, { major: 2, minor: 42, patch: 0 }],
        [true, { major: 2, minor: 41, patch: 5 }],
        [true, { major: 2, minor: 41, patch: 6 }],
        [false, { major: 2, minor: 41, patch: 4 }],
        [true, { major: 2, minor: 40, patch: 9 }],
        [true, { major: 2, minor: 40, patch: 11 }],
        [false, { major: 2, minor: 40, patch: 8 }],
    ])(
        'sets utilizeGistApiForPrefetchedOrganisationUnits to %s when server version is %s',
        async (outcome, serverVersion) => {
            useConfig.mockReturnValue({ serverVersion })
            const { result } = renderHook(() => useFeatureToggleContext())
            expect(result.current).toHaveProperty(
                'utilizeGistApiForPrefetchedOrganisationUnits'
            )
            expect(
                result.current.utilizeGistApiForPrefetchedOrganisationUnits
            ).toBe(outcome)
        }
    )
})
