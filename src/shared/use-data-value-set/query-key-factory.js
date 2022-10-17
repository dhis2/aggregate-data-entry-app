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
