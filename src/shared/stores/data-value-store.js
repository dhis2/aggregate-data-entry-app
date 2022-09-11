import create from 'zustand'

export const useValueStore = create((set, get) => ({
    dataValueSet: {
        datavalues: {},
        minMaxValues: [],
    },
    getDataValue: ({ dataElementId, cocId }) =>
        get().dataValueSet.dataValues[dataElementId]?.[cocId],
    getDataValues: () => get().datavalueSet?.dataValues,
    setDataValueSet: (values) => set({ dataValueSet: values ?? {} }),
    getMinMaxValues: ({ dataElementId, categoryOptionComboId }) => {
        return get().dataValueSet?.minMaxValues?.find(
            (minMaxValue) =>
                minMaxValue.categoryOptionCombo === categoryOptionComboId &&
                minMaxValue.dataElement === dataElementId
        )
    },
}))
