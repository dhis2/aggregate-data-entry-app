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
                paging: false,
            },
        },
    ]

    return queryKey
}
