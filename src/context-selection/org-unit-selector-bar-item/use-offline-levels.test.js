import {
    computeDeepestLevel,
    computeOfflineLevels,
} from './use-offline-levels.js'

describe('useOfflineLevels', () => {
    describe('computeDeepestLevel', () => {
        it('returns a value based on offlineLevels if available', () => {
            const actual = computeDeepestLevel(2, 3, 2)
            expect(actual).toBe(4)
        })
        it('returns a value based on configOfflineLevel if offlineLevels is not provided', () => {
            const actual = computeDeepestLevel(2, undefined, 3)
            expect(actual).toBe(3)
        })
    })
    describe('computeOfflineLevels', () => {
        it('returns a value based on offlineLevels if available', () => {
            const userOrgUnitRoot = {
                id: 'a',
                level: 2,
            }
            const filledOrganisationUnitLevels = [
                {
                    id: 'One',
                    level: 1,
                },
                {
                    id: 'Two',
                    level: 2,
                    offlineLevels: 3,
                },
            ]
            const configOfflineOrgUnitLevel = 2
            const actual = computeOfflineLevels(
                userOrgUnitRoot,
                filledOrganisationUnitLevels,
                configOfflineOrgUnitLevel
            )
            expect(actual).toEqual([2, 3, 4])
        })
        it('returns a value based on configOfflineLevel if offlineLevels is not provided', () => {
            const userOrgUnitRoot = {
                id: 'a',
                level: 2,
            }
            const filledOrganisationUnitLevels = [
                {
                    id: 'One',
                    level: 1,
                },
                {
                    id: 'Two',
                    level: 2,
                },
            ]
            const configOfflineOrgUnitLevel = 2
            const actual = computeOfflineLevels(
                userOrgUnitRoot,
                filledOrganisationUnitLevels,
                configOfflineOrgUnitLevel
            )
            expect(actual).toEqual([2])
        })
    })
})
