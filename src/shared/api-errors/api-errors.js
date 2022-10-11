// errors that will most likely succeed when server is reachable
const temporalErrorsStatusCodes = new Set([401, 403, 502, 503, 504])

export const shouldTriggerOffline = (error) => {
    return temporalErrorsStatusCodes.has(error?.httpStatusCode)
}

export const shouldPersistError = (error) => {
    return temporalErrorsStatusCodes.has(error?.httpStatusCode)
}
