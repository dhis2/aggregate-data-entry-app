const createMutationKey =
    ([rootKey, subScope]) =>
    (params) => {
        const mergedState = {
            ...subScope,
        }
        if (params) {
            mergedState.params = params
        }
        return [...rootKey, { ...mergedState }]
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
 * ['dataValues, { method: update }] will match all keys with update. Eg, even
    ['dataValues, { method: update, entity: 'file' }]
    When checking for active mutation (useIsMutating) you can match based on ‘update’
    and mutations for file will be included in the match
*/

const rootKey = ['dataEntry/dataSetCompletion']
export const mutationKeys = {
    complete: createMutationKey([rootKey]),
}
