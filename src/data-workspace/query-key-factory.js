export const dataValueSets = {
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
                cp: categoryOptionIds.join(';'),
            },
        },
    ],
}

export const getCompleteFormQueryKey = ({
    dataSetId,
    periodId,
    orgUnitId,
    categoryComboId,
    categoryOptionIds,
}) => {
    const params = {
        pe: periodId,
        ou: orgUnitId,
        // @TODO: Revisit these params to filter by AOC https://dhis2.atlassian.net/browse/TECH-1287
        cc: categoryComboId,
        cp: categoryOptionIds?.join(';'),
    }

    const validationQueryKey = [
        `validation/dataSet/${dataSetId}`,
        {
            params,
        },
    ]
    return validationQueryKey
}

export const getIncompleteFormQueryKey = ({
    dataSetId,
    periodId,
    orgUnitId,
    categoryComboId,
    categoryOptionIds,
}) => {
    const params = {
        pe: periodId,
        ou: orgUnitId,
        // @TODO: Revisit these params to filter by AOC https://dhis2.atlassian.net/browse/TECH-1287
        cc: categoryComboId,
        cp: categoryOptionIds?.join(';'),
    }

    const validationQueryKey = [
        `validation/dataSet/${dataSetId}`,
        {
            params,
        },
    ]
    return validationQueryKey
}
