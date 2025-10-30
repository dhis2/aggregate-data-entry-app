import { renderHook } from '@testing-library/react'
import { useOrgUnit } from '../../shared/use-org-unit/use-organisation-unit.js'
import useExpandedState from './use-expanded-state.js'
import useUserOrgUnits from './use-user-org-units.js'

jest.mock('./use-user-org-units.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('../../shared/use-org-unit/use-organisation-unit.js', () => ({
    useOrgUnit: jest.fn(),
}))

describe('useExpandedState', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    it('populates initially expanded up to parent of expanded org unit', () => {
        useOrgUnit.mockReturnValueOnce({
            data: { path: '/ImspTQPwCqd/O6uvpzGd5pu/YuQRtpLP10I/DiszpKrYNg8' },
        })
        const useUserOrgUnitsMock = jest.fn(() => ({ data: ['ImspTQPwCqd'] }))
        useUserOrgUnits.mockImplementationOnce(useUserOrgUnitsMock)

        const { result } = renderHook(useExpandedState)

        expect(result.current.expanded).toEqual([
            '/ImspTQPwCqd',
            '/ImspTQPwCqd/O6uvpzGd5pu',
            '/ImspTQPwCqd/O6uvpzGd5pu/YuQRtpLP10I',
        ])
    })
    it('populates initially expanded with respect to user organisation units', () => {
        useOrgUnit.mockReturnValueOnce({
            data: { path: '/ImspTQPwCqd/O6uvpzGd5pu/YuQRtpLP10I/DiszpKrYNg8' },
        })
        const useUserOrgUnitsMock = jest.fn(() => ({ data: ['O6uvpzGd5pu'] }))
        useUserOrgUnits.mockImplementationOnce(useUserOrgUnitsMock)

        const { result } = renderHook(useExpandedState)

        expect(result.current.expanded).toEqual([
            '/O6uvpzGd5pu',
            '/O6uvpzGd5pu/YuQRtpLP10I',
        ])
    })
    it('uses the highest user assigned organisation unit when populating initially expanded', () => {
        useOrgUnit.mockReturnValueOnce({
            data: { path: '/ImspTQPwCqd/O6uvpzGd5pu/YuQRtpLP10I/DiszpKrYNg8' },
        })
        const useUserOrgUnitsMock = jest.fn(() => ({
            data: ['O6uvpzGd5pu', 'YuQRtpLP10I'],
        }))
        useUserOrgUnits.mockImplementationOnce(useUserOrgUnitsMock)

        const { result } = renderHook(useExpandedState)

        expect(result.current.expanded).toEqual([
            '/O6uvpzGd5pu',
            '/O6uvpzGd5pu/YuQRtpLP10I',
        ])
    })
})
