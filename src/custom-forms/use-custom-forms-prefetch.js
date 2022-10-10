import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQueryClient } from '@tanstack/react-query'
import keys from './query-key-factory.js'
import useCustomForms from './use-custom-forms.js'

function getAlertSettings() {
    return { warning: true }
}

const useCustomFormsPrefetch = () => {
    const { show: showAlert } = useAlert((message) => message, getAlertSettings)
    const queryClient = useQueryClient()
    const { isSuccess, isError, error, data } = useCustomForms()

    if (isError) {
        showAlert(
            i18n.t(
                "Custom forms couldn't be made available offline. {{error}}",
                { error }
            )
        )
    } else if (isSuccess) {
        for (const customForm of data) {
            const queryKey = keys.byId(customForm.id)

            // Search the cache for a custom form with a matching version
            const cachedCustomForm = queryClient.getQueryData(queryKey, {
                predicate: (query) =>
                    customForm.version === query?.meta?.version,
            })

            if (!cachedCustomForm) {
                // Set the version on the query metadata so we can use that for comparing
                queryClient.prefetchQuery(queryKey, {
                    meta: {
                        version: customForm.version,
                        persist: true,
                    },
                })
            }
        }
    }
}

export default useCustomFormsPrefetch
