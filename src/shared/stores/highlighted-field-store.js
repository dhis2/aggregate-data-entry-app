import create from 'zustand'

export const useHighlightedFieldStore = create((set, get) => ({
    item: null,

    setHighlightedField: (field) => set({ item: field }),
    isFieldHighlighted: ({ dataElementId, categoryOptionComboId }) =>
        get().item?.de?.id === dataElementId &&
        get().item?.coc?.id === categoryOptionComboId,
}))
