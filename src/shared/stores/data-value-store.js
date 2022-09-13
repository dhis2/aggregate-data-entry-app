import create from 'zustand'

const inititalState = {
    dataValueSet: {
        dataValues: {},
        minMaxValues: [],
    },
}

export const useValueStore = create((set, get) => ({
    ...inititalState,
    getDataValue: ({ dataElementId, cocId }) => {
        return get().dataValueSet.dataValues[dataElementId]?.[cocId]
    },

    getDataValues: () => get().dataValueSet?.dataValues,
    setDataValueSet: (values) => set({ dataValueSet: values ?? inititalState }),
    getMinMaxValues: ({ dataElementId, categoryOptionComboId }) => {
        return get().dataValueSet?.minMaxValues?.find(
            (minMaxValue) =>
                minMaxValue.categoryOptionCombo === categoryOptionComboId &&
                minMaxValue.dataElement === dataElementId
        )
    },
}))
