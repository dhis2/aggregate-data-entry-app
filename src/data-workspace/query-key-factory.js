export const dataValueSets = {
    byIds: ({ dataSetId, periodId, orgUnitId, attributeOptionCombo }) => [
        'dataValueSets',
        {
            params: {
                dataSet: dataSetId,
                period: periodId,
                orgUnit: orgUnitId,
                attributeOptionCombo,
            },
        },
    ],
}
