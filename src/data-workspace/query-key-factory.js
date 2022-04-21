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
