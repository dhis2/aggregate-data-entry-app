export const dataValueSets = {
    byIds: ({ ds, pe, ou }) => {
        const params = { ds, pe, ou }
        return ['dataEntry/dataValues', { params }]
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
                cp: categoryOptionIds.join(','),
            },
        },
    ],
}
