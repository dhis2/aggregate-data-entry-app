import create from 'zustand'

export const useHighlightedFieldStore = create((set, get) => ({
    highlightedFieldId: null,

    /**
     *
     * @param {} field
     * @param {} field.dataElementId id of the dataElement
     * @param {} field.categoryOptionComboId id of the categoryOptionCombo
     * @returns
     */
    setHighlightedField: (highlightedFieldId) => set({ highlightedFieldId }),
    getHighlightedField: () => get().highlightedFieldId,
    isFieldHighlighted: ({ dataElementId, categoryOptionComboId }) => {
        const highlightedFieldId = get().highlightedFieldId

        return (
            !!highlightedFieldId &&
            highlightedFieldId.dataElementId === dataElementId &&
            highlightedFieldId.categoryOptionComboId === categoryOptionComboId
        )
    },
}))
