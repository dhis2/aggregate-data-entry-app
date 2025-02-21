import { act, renderHook } from '@testing-library/react'
import { useHighlightedFieldStore } from './highlighted-field-store.js'

describe('highlighted field store', () => {
    const initialState = useHighlightedFieldStore.getState()

    beforeEach(() => {
        useHighlightedFieldStore.setState(initialState)
    })

    it('should have no initially highlighted field', () => {
        const { result } = renderHook(useHighlightedFieldStore)
        expect(result.current.getHighlightedField()).toBe(null)
    })

    it('should accept a new highlighted field', async () => {
        const nextHighlightedField = {
            dataElementId: 'de-id',
            categoryOptionComboId: 'coc-id',
        }

        const { result } = renderHook(useHighlightedFieldStore)

        act(() => {
            result.current.setHighlightedField(nextHighlightedField)
        })

        const highlightedField = result.current.getHighlightedField()
        expect(highlightedField).toBe(nextHighlightedField)
    })

    it('yield true when checking whether the currently highlighted field is highlighted', () => {
        const nextHighlightedField = {
            dataElementId: 'de-id',
            categoryOptionComboId: 'coc-id',
        }

        useHighlightedFieldStore.setState({
            highlightedFieldId: nextHighlightedField,
        })
        const { result } = renderHook(useHighlightedFieldStore)

        const isHighlighted = result.current.isFieldHighlighted({
            dataElementId: 'de-id',
            categoryOptionComboId: 'coc-id',
        })
        expect(isHighlighted).toBe(true)
    })
})
