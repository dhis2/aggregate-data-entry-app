export const dataValueSets = {
    byIds: ({
        dataSetId,
        periodId,
        orgUnitId,
        attributeCombo,
        attributeOptions,
    }) => [
        'dataValueSets',
        {
            params: {
                dataSet: dataSetId,
                period: periodId,
                orgUnit: orgUnitId,
                attributeCombo,
                attributeOptions,
            },
        },
    ],
}

export const dataValueContext = {
    byParams: ({
        dataElementId,
        periodId,
        orgUnitId,
        categoryOptionIds,
        categoryComboId,
        categoryOptionComboId,
    }) => [
        'dataEntry/dataValueContext',
        {
            params: {
                de: dataElementId,
                pe: periodId,
                ou: orgUnitId,
                co: categoryOptionComboId,
                cc: categoryComboId,
                cp: categoryOptionIds.join(','),
            },
        },
    ],
}
