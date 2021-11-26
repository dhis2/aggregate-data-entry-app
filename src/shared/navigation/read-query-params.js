import { parse } from 'query-string'
import { history } from './history.js'

export const readQueryParams = () => {
    // @TODO(eslint): remove unused rule when implementing this function
    // eslint-disable-next-line no-unused-vars
    const params = parse(history.location.search)

    // ensure only known params are returned
    return {}
}
