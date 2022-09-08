export const getValidationQueryKey = ({
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

export const getValidationMetaDataQueryKey = (datasetId) => {
    const queryKey = [
        `validationRules`,
        {
            params: {
                dataSet: datasetId,
                fields: [
                    'id',
                    'importance',
                    'operator',
                    'leftSide',
                    'rightSide',
                    'displayInstruction',
                    'displayDescription',
                    'displayName',
                ],
            },
        },
    ]

    return queryKey
}
