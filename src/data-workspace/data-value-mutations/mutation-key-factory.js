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

/**
 * MutationKeys for dataValues.
 * These are all functions that can be called with the dataValueParams
 * to narrow down the mutation
 *
 * Example keys:
 *   mutationKeys.all() ==> ['dataValues']
 *   mutationKeys.update(dvParams)
 *      ==> ['dataValues', { method: 'update', params: dvParams }]
 *   mutationKeys.file(dvParams)
 *      ==> ['dataValues', { method: 'update', entity: 'file', params: dvParams }]
 *   mutationKeys.delete() ==> ['dataValues', { method: 'delete' }]
 * etc.
 *
 */
export const mutationKeys = {
    all: createSubKey(),
    update: createSubKey({ method: 'update' }),
    file: createSubKey({ method: 'update', entity: 'file' }),
    delete: createSubKey({ method: 'delete' }),
}
