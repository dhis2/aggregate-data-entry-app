import { act, renderHook } from '@testing-library/react'
import { useValidationStore } from './validation-store.js'

describe('useValidationStore', () => {
    it('should return the initial validtionToRefresh', () => {
        const { result } = renderHook(useValidationStore)
        expect(result.current.getValidationToRefresh()).toBe(false)
    })

    it('should update validationToRefresh', async () => {
        const { result, waitFor } = renderHook(useValidationStore)

        act(() => {
            result.current.setValidationToRefresh(true)
        })

        expect(result.current.getValidationToRefresh()).toBe(true)
    })
})
