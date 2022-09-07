const rootKey = ['dataValues']

const createSubKey = (subScope) => (params) => {
    const theState = {
        ...subScope,
    }
    if (params) {
        theState.params = params
    }
    return [...rootKey, { ...theState }]
}

export const mutationKeys = {
    all: createSubKey(),
    update: createSubKey({ method: 'update' }),
    file: createSubKey({ method: 'update', entity: 'file' }),
    delete: createSubKey({ method: 'delete' }),
}
