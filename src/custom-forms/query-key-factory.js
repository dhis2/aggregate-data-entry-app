const queryKeyFactory = {
    all: () => [
        'metadata',
        {
            params: {
                'dataSets:fields': 'id,formType,version',
            },
        },
    ],
    htmlCode: (id) => [
        'metadata',
        {
            params: {
                'dataSets:fields': 'dataEntryForm[htmlCode],version',
                filter: `id:eq:${id}`,
            },
        },
    ],
}

export default queryKeyFactory
