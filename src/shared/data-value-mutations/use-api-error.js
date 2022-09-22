import { useAlert } from '@dhis2/app-runtime'

/**
 * A dictionary taking the shape Dictionary<ErrorCode, String> to override the display message for a certain error code
 * Potential error codes can be found here: https://github.com/dhis2/dhis2-core/blob/28a6aa052f221626e583a84bc18d80c0a8fa0927/dhis-2/dhis-api/src/main/java/org/hisp/dhis/feedback/ErrorCode.java#L97
 */
const customErrorMessages = {
    // E2017: i18n.t('Here we could override the message for E2017 error with a custom message in the FE')
}

const useApiError = () => {
    const { show: showAlert } = useAlert(
        (message) => message,
        () => ({
            critical: true,
        })
    )

    const onError = (error) => {
        const customMessage = customErrorMessages[error?.details?.errorCode]
        // show a custom message if one is set, otherwise display the error returned from the API
        showAlert(customMessage ?? error?.message)
        // Also log the stack trace to the console (useful if there's a non-network error)
        console.error(error)
    }
    return {
        onError,
    }
}

export default useApiError
