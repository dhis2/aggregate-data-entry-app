import { stringify } from 'query-string'
import { history } from './history.js'

// @TODO(eslint): remove unused rule when implementing this function
// eslint-disable-next-line no-unused-vars
export const pushStateToHistory = (state) => {
    const paramString = stringify({})
    const search = paramString ? `?${paramString}` : ''

    // Only push if the search string changes
    if (search !== history.location.search) {
        history.push({ pathname: '/', search })
    }
}
