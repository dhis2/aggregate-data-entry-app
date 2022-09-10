import create from 'zustand'

export const useValueStore = create((set, get) => ({
    dataValues: {},
    getDataValue: ({ dataElementId, cocId }) =>
        get().dataValues[dataElementId]?.[cocId],
    setDataValues: (values) => set({ dataValues: values ?? {} }),
}))
