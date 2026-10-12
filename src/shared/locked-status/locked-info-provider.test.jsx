import { renderHook } from '@testing-library/react'
import React from 'react'
import { useCanUserEditFields } from '../use-user-info/index.js'
import { LockedProvider } from './locked-info-provider.jsx'
import { useLockedContext } from './use-locked-context.js'

jest.mock('../use-user-info/index.js', () => ({
    useCanUserEditFields: jest.fn(),
}))

const renderLocked = (props) =>
    renderHook(() => useLockedContext(), {
        wrapper: ({ children }) => (
            <LockedProvider {...props}>{children}</LockedProvider>
        ),
    }).result.current.locked

describe('LockedProvider', () => {
    beforeEach(() => {
        useCanUserEditFields.mockReturnValue(true)
    })

    it('is open by default for users who can edit', () => {
        expect(renderLocked()).toBe(false)
    })

    it('is locked when forced, even for users who can edit', () => {
        expect(renderLocked({ forceLocked: true })).toBe(true)
    })

    it('is locked for users who cannot edit', () => {
        useCanUserEditFields.mockReturnValue(false)

        expect(renderLocked()).toBe(true)
    })
})
