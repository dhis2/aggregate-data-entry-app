import { useDataEngine } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react-hooks'
import loadOfflineLevel from './load-offline-level.js'
import useLoadOfflineLevels from './use-load-offline-levels.js'
import useOfflineLevelsToLoad from './use-offline-levels-to-load.js'
import useOrganisationUnitLevels from './use-organisation-unit-levels.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataEngine: jest.fn(),
}))

jest.mock('./load-offline-level.js', () => ({
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
        data: [
            { offlineLevels: 2, id: 'foo' },
            { offlineLevels: 1, id: 'bar' },
        ],
    }

    useOrganisationUnitLevels.mockImplementation(() => ({}))
    useOfflineLevelsToLoad.mockImplementation(() => offlineLevelToLoad)

    afterEach(() => {
        useDataEngine.mockClear(), loadOfflineLevel.mockClear()
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
