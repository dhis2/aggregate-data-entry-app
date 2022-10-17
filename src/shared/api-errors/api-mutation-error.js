import { FetchError } from '@dhis2/app-service-data/build/es/engine/index.js'

export class ApiMutationError extends FetchError {
    constructor({ message, type, details = {} }, mutationKey, value) {
        super({ message, type, details })
        this.mutationKey = mutationKey
        this.value = value
    }
}

export { FetchError }
