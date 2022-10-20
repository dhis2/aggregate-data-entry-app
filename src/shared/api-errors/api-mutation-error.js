import i18n from '../../locales/index.js'

/* A dictionary taking the shape Dictionary<ErrorCode, (string | (error) => string)> to override the display message for a certain error code
 * Potential error codes can be found here: https://github.com/dhis2/dhis2-core/blob/28a6aa052f221626e583a84bc18d80c0a8fa0927/dhis-2/dhis-api/src/main/java/org/hisp/dhis/feedback/ErrorCode.java#L97
 */
const customErrorMessages = {
    // E2017: i18n.t('Here we could override the message for E2017 error with a custom message in the FE')
    E2022: i18n.t(`Selected period is after latest open future period.`),
}

/**
 * A dictionary taking the shape Dictionary<HttpStatusCode, (string | (error) => string) >
 */
const statusCodeErrorMessages = {
    // 400:  i18n.t(
    //         'Session Expired. Please reload to log in again. You will not lose any data.'
    //      ),
}

/**
 * This is a list over maps from error.details.key to the customErrorMessages-map above.
 * Array is used to preserve the order.
 *  Eg if error has both .errorCode and .httpStatusCode, errorCode will be used to get the custom-message.
 */

const errorDetailsMessagePriority = [
    ['errorCode', customErrorMessages],
    ['httpStatusCode', statusCodeErrorMessages],
]

// FetchError is not exposed from app-runtime
// TODO: remove once https://github.com/dhis2/app-runtime/pull/1267 is merged

export class FetchError extends Error {
    constructor({ message, type, details = {} }) {
        super(message)
        this.type = type
        this.details = details
    }
}

export class ApiMutationError extends FetchError {
    constructor({ message, type, details = {} }, mutationKey, value) {
        super({ message, type, details })
        this.mutationKey = mutationKey
        this.value = value
        this.displayMessage = this.resolveDisplayMessage()
    }

    resolveDisplayMessage() {
        for (const [key, errorMap] of errorDetailsMessagePriority) {
            const errorCode = this.details[key]
            const mappedCode = errorMap[errorCode]
            if (mappedCode) {
                return typeof mappedCode === 'function'
                    ? mappedCode(this)
                    : mappedCode
            }
        }
        return this.message
    }
}

export const isFetchError = (error) => {
    // instanceof does not work because FetchError is not the same class as app-runtime
    return error.constructor.name === FetchError.name
}
