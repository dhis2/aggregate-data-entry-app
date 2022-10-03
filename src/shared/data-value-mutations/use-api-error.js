import { useAlert } from '@dhis2/app-runtime'
/**
 * A dictionary taking the shape A dictionary taking the shape Dictionary<ErrorCode, AlertProps> to override the display message for a certain error code
 * Potential error codes can be found here: https://github.com/dhis2/dhis2-core/blob/28a6aa052f221626e583a84bc18d80c0a8fa0927/dhis-2/dhis-api/src/main/java/org/hisp/dhis/feedback/ErrorCode.java#L97
 */
const customErrorAlertProps = {
    // E2017: { message: i18n.t('Here we could override the message for E2017 error with a custom message in the FE') }
}

/**
 * A dictionary taking the shape Dictionary<ErrorCode, AlertProps>
 */
const statusCodeErrorAlertProps = {
    // this is handled in `retry`
    // 401: {
    //     message: i18n.t(
    //         'Session Expired. Please reload to log in again. You will not lose any data.'
    //     ),
    //     actions: [{ label: 'Reload now', onClick: () => location.reload() }],
    // },
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

const resolveAlertProps = (error) => {
    let errorMessage = {
        message: error.message,
    }
    // find alertProps for errorCode, using detail-prop according to priority above
    for (const [key, errorMap] of errorDetailsMessagePriority) {
        const errorCode = error?.details[key]
        if (errorCode) {
            errorMessage = errorMap[errorCode]
            break
        }
    }
    return errorMessage
}

export const useApiError = () => {
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        (props) => ({
            ...props,
            critical: true,
        })
    )

    const onError = function handleError(error) {
        if (error?.type === 'network') {
            return {
                shouldRollback: false,
            }
        } else {
            const alertProps = resolveAlertProps(error)
            // show a custom message if one is set, otherwise display the error returned from the API
            showAlert(alertProps)
            // Also log the stack trace to the console (useful if there's a non-network error)
            console.error(error)

            return {
                shouldRollback: true,
            }
        }
    }
    return {
        onError,
    }
}

export default useApiError
