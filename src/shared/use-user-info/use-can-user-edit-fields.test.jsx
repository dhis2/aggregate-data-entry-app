import { renderHook } from '@testing-library/react'
import React from 'react'
import { ReadOnlyContext } from '../embedded/index.js'
import useCanUserEditFields from './use-can-user-edit-fields.js'
import { useUserInfo } from './use-user-info.js'

jest.mock('./use-user-info.js', () => ({
    useUserInfo: jest.fn(),
}))

const renderWithReadOnly = (readOnly) =>
    renderHook(useCanUserEditFields, {
        wrapper: ({ children }) => (
            <ReadOnlyContext.Provider value={readOnly}>
                {children}
            </ReadOnlyContext.Provider>
        ),
    })

describe('useCanUserEditFields', () => {
    beforeEach(() => {
        useUserInfo.mockReturnValue({ data: { authorities: ['ALL'] } })
    })

    it('lets a user with the authority edit fields', () => {
        const { result } = renderWithReadOnly(false)
        expect(result.current).toBe(true)
    })

    it("doesn't let anyone edit a read-only form", () => {
        const { result } = renderWithReadOnly(true)
        expect(result.current).toBe(false)
    })
})
