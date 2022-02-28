import { useQuery } from 'react-query'
import keys from './query-key-factory.js'

const useCustomForm = ({ id, version }) => {
    if (!id || !version) {
        throw new Error('Both a version and an id are required')
    }

    return useQuery(keys.byId(id), {
        meta: { version },
    })
}

export default useCustomForm
