const queryKeyFactory = {
    all: [
        'dataSets',
        {
            params: {
                fields: 'dataEntryForm[id],formType,version',
            },
        },
    ],
    byId: (id) => [
        'dataEntry/customForms',
        {
            id,
        },
    ],
}

export default queryKeyFactory
