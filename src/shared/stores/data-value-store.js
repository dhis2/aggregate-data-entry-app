import { createStore, useStore } from 'zustand'

export const initialState = {
    dataValueSet: {
        dataValues: {},
        minMaxValues: [],
    },
}

export const valueStore = createStore((set, get) => ({
    ...initialState,
    getDataValue: ({ dataElementId, categoryOptionComboId }) => {
        return get().dataValueSet.dataValues?.[dataElementId]?.[
            categoryOptionComboId
        ]
    },

    isComplete: () => !!get().dataValueSet?.completeStatus?.complete,

    getDataValues: () => get().dataValueSet?.dataValues,
    setDataValueSet: (values) =>
        set({
            dataValueSet: values ?? initialState.dataValueSet,
        }),
    getMinMaxValues: ({ dataElementId, categoryOptionComboId }) => {
        return get().dataValueSet?.minMaxValues?.find(
            (minMaxValue) =>
                minMaxValue.categoryOptionCombo === categoryOptionComboId &&
                minMaxValue.dataElement === dataElementId
        )
    },
    hasComment: ({ dataElementId, categoryOptionComboId }) => {
        const dataValue = get().getDataValue({
            dataElementId,
            categoryOptionComboId,
        })

        return !!dataValue?.comment
    },
}))

export function useValueStore(selector) {
    return useStore(valueStore, selector)
}
