import { stringify } from 'query-string'

export const createHref = (state) => `/#/?${stringify(state)}`
