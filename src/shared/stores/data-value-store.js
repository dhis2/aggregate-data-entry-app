import create from 'zustand'

const initialState = {
    dataValueSet: {
        dataValues: {},
        minMaxValues: [],
    },
}

export const useValueStore = create((set, get) => ({
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
