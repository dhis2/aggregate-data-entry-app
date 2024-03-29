import { useSyncErrorsStore } from '../stores/sync-errors-store.js'
import { shouldRollbackError } from './api-errors.js'
import { ApiMutationError } from './api-mutation-error.js'

export const useApiError = () => {
    const setSyncError = useSyncErrorsStore((state) => state.setError)

    const onError = function handleError(error) {
        const shouldRollback = shouldRollbackError(error)
        // dont treat non-rollback errors as errors
        if (!shouldRollback) {
            return
        }
        // Log the stack trace to the console
        console.error(error)
        // error should be ApiMutationError, but handle other errors gracefully
        if (!(error instanceof ApiMutationError)) {
            return
        }

        setSyncError(error)
    }

    return {
        onError,
    }
}

export default useApiError
