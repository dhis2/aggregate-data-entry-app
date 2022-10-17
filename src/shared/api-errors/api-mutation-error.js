import { FetchError } from '@dhis2/app-service-data/build/es/engine/index.js'
import i18n from '../../locales/index.js'

/* A dictionary taking the shape Dictionary<ErrorCode, (string | (error) => string)> to override the display message for a certain error code
 * Potential error codes can be found here: https://github.com/dhis2/dhis2-core/blob/28a6aa052f221626e583a84bc18d80c0a8fa0927/dhis-2/dhis-api/src/main/java/org/hisp/dhis/feedback/ErrorCode.java#L97
 */
const customErrorAlertProps = {
    // E2017: i18n.t('Here we could override the message for E2017 error with a custom message in the FE')
    E2022: i18n.t(`Selected period is after latest open future period.`),
}

/**
 * A dictionary taking the shape Dictionary<HttpStatusCode, (string | (error) => string) >
 */
const statusCodeErrorAlertProps = {
    // 400:  i18n.t(
    //         'Session Expired. Please reload to log in again. You will not lose any data.'
    //      ),
}

/**
 * This is a list over maps from error.details.key to the customErrorAlertProps-map above.
 * Array is used to preserve the order.
 *  Eg if error has both .errorCode and .httpStatusCode, errorCode will be used to get the custom-message.
 */

const errorDetailsMessagePriority = [
    ['errorCode', customErrorAlertProps],
    ['httpStatusCode', statusCodeErrorAlertProps],
]

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
            console.log({ errorCode, mappedCode })
            if (mappedCode) {
                return typeof mappedCode === 'function'
                    ? mappedCode(this)
                    : mappedCode
            }
        }
        return this.message
    }
}

export const isFetchError = (error) => error instanceof FetchError
