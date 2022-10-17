import { useAlert } from '@dhis2/app-runtime'
import { useSyncErrorsStore } from '../stores/sync-errors-store.js'
import { shouldRollbackError } from './api-errors.js'
import { ApiMutationError } from './api-mutation-error.js'

export const useApiError = () => {
    const { show: showAlert } = useAlert((message) => message, {
        critical: true,
    })

    const setSyncError = useSyncErrorsStore((state) => state.setError)

    const onError = function handleError(error) {
        const shouldRollback = shouldRollbackError(error)
        // dont treat non-rollback errors as errors
        if (!shouldRollback) {
            return { shouldRollback }
        }
        // Log the stack trace to the console
        console.error(error)
        // error should be ApiMutationError, but handle other errors gracefully
        if (!(error instanceof ApiMutationError)) {
            return { shouldRollback }
        }

        const alertMessage = error.displayMessage
        setSyncError(error)
        showAlert(alertMessage)

        return {
            shouldRollback,
        }
    }

    return {
        onError,
    }
}

export default useApiError
