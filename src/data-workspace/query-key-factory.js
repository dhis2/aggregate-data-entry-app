export const dataValueSets = {
    all: ['dataEntry/dataValues'],
    byIds: ({
        dataSetId,
        periodId,
        orgUnitId,
        categoryComboId,
        categoryOptionIds = [],
    }) => {
        const params = {
            ds: dataSetId,
            pe: periodId,
            ou: orgUnitId,
            cc: categoryComboId,
            cp: categoryOptionIds.join(';'),
        }

        return [...dataValueSets.all, { params }]
    },
}

export const dataValueContext = {
    byParams: ({
        dataElementId,
        periodId,
        orgUnitId,
        categoryOptionIds = [],
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
                cp: categoryOptionIds.join(';'),
            },
        },
    ],
}
