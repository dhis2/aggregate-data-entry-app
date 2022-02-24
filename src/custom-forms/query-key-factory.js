const queryKeyFactory = {
    metadata: [
        'metadata',
        {
            params: {
                'dataSets:fields': 'dataEntryForm[id],formType,version',
            },
        },
    ],
    byId: (id) => [
        'dataEntryForms',
        {
            id,
            params: {
                fields: 'htmlCode,version',
            },
        },
    ],
}

export default queryKeyFactory
