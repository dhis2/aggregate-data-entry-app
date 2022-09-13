import { useDataEngine } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react-hooks'
import loadOfflineLevel from './load-offline-level.js'
import useLoadConfigOfflineOrgUnitLevel from './use-load-config-offline-org-unit-level.js'
import useLoadOfflineLevels from './use-load-offline-levels.js'
import useOfflineLevelsToLoad from './use-offline-levels-to-load.js'
import useOrganisationUnitLevels from './use-organisation-unit-levels.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataEngine: jest.fn(),
    useAlert: jest.fn(() => ({
        show: jest.fn(),
    })),
}))

jest.mock('./load-offline-level.js', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.resolve()),
}))

jest.mock('./use-load-config-offline-org-unit-level.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('./use-offline-levels-to-load.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('./use-organisation-unit-levels.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('useLoadOfflineLevels', () => {
    const dataEngine = {}
    useDataEngine.mockImplementation(() => dataEngine)

    const offlineLevelToLoad = {
        data: {
            offlineLevelsToLoad: [
                { offlineLevels: 2, id: 'foo' },
                { offlineLevels: 1, id: 'bar' },
            ],
            userOrganisationUnits: [],
        },
    }

    jest.spyOn(console, 'error').mockImplementation(() => null)
    useLoadConfigOfflineOrgUnitLevel.mockImplementation(() => ({}))
    useOrganisationUnitLevels.mockImplementation(() => ({}))
    useOfflineLevelsToLoad.mockImplementation(() => offlineLevelToLoad)

    afterEach(() => {
        useDataEngine.mockClear(), loadOfflineLevel.mockClear()
        useLoadConfigOfflineOrgUnitLevel.mockClear()
        useOfflineLevelsToLoad.mockClear()
        useOrganisationUnitLevels.mockClear()
    })

    it('should call "loadOfflineLevel" for each offline level to load', async () => {
        const { result, waitForNextUpdate } = renderHook(useLoadOfflineLevels)

        expect(result.current).toBe(false)
        await waitForNextUpdate()

        expect(loadOfflineLevel).toHaveBeenCalledTimes(2)
        expect(loadOfflineLevel).toHaveBeenNthCalledWith(1, {
            dataEngine,
            offlineLevels: 2,
            id: 'foo',
        })
        expect(loadOfflineLevel).toHaveBeenNthCalledWith(2, {
            dataEngine,
            offlineLevels: 1,
            id: 'bar',
        })

        expect(result.current).toBe(true)
    })
})
