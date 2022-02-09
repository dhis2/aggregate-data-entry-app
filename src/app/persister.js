import { get, set, del } from 'idb-keyval'

/**
 * Creates an Indexed DB persister
 * @see https://react-query.tanstack.com/plugins/persistQueryClient#building-a-persistor
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
const createIDBPersister = (idbValidKey = 'reactQuery') => {
    return {
        persistClient: (client) => {
            return set(idbValidKey, client)
        },
        restoreClient: () => {
            return get(idbValidKey)
        },
        removeClient: () => {
            return del(idbValidKey)
        },
    }
}

export default createIDBPersister
