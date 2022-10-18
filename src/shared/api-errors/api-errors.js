// errors that will most likely succeed when server is reachable
const temporalErrorsStatusCodes = new Set([401, 403, 502, 503, 504])

const isTemporalError = (error) => {
    return (
        error?.type === 'network' ||
        temporalErrorsStatusCodes.has(error?.details.httpStatusCode)
    )
}

export const shouldTriggerOffline = (error) => {
    return isTemporalError(error)
}

export const shouldPersistError = (error) => {
    return isTemporalError(error)
}

export const shouldRollbackError = (error) => {
    return !isTemporalError(error)
}
