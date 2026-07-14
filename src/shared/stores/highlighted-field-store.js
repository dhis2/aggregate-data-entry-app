import create from 'zustand'

export const useHighlightedFieldStore = create((set, get) => ({
    highlightedFieldId: null,

    /**
     *
     * @param {} field
     * @param {} field.dataElementId id of the dataElement
     * @param {} field.categoryOptionComboId id of the categoryOptionCombo
     * @param {} field.indicatorId id of the indicator
     * @returns
     */
    setHighlightedField: (highlightedFieldId) => set({ highlightedFieldId }),
    getHighlightedField: () => get().highlightedFieldId,
    isFieldHighlighted: ({
        dataElementId,
        categoryOptionComboId,
        indicatorId,
    }) => {
        const highlightedField = get().highlightedFieldId

        if (!highlightedField) {
            return false
        }

        if (
            dataElementId &&
            highlightedField.dataElementId === dataElementId &&
            categoryOptionComboId &&
            highlightedField.categoryOptionComboId === categoryOptionComboId
        ) {
            return true
        }

        if (indicatorId && highlightedField?.indicatorId === indicatorId) {
            return true
        }

        return false
    },
}))
