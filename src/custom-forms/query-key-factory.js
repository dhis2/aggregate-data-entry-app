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
        'dataEntryForms',
        {
            id,
            params: {
                fields: 'htmlCode',
            },
        },
    ],
}

export default queryKeyFactory
