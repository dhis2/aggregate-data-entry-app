import create from 'zustand'

export const useHighlightedFieldStore = create((set, get) => ({
    item: null,

    /**
     *
     * @param {} field
     * @param {} field.dataElementId id of the dataElement
     * @param {} field.categoryOptionComboId id of the categoryOptionCombo
     * @returns
     */
    setHighlightedField: ({ dataElementId, categoryOptionComboId }) =>
        set({ item: { dataElementId, categoryOptionComboId } }),
    isFieldHighlighted: ({ dataElementId, categoryOptionComboId }) => {
        const item = get().item
        if (!item) {
            return false
        }
        return (
            item.dataElementId === dataElementId &&
            item.categoryOptionComboId === categoryOptionComboId
        )
    },
}))
