import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useIsMutating } from '@tanstack/react-query'
import { useState } from 'react'
import { useSetRightHandPanel } from '../right-hand-panel/index.js'
import {
    selectors,
    useConnectionStatus,
    useDataSetId,
    useImperativeCancelCompletionMutation,
    useMetadata,
    useSetFormCompletionMutation,
    useSetFormCompletionMutationKey,
    useValidationResult,
    validationResultsSidebarId,
} from '../shared/index.js'

const validationFailedMessage = i18n.t(
    "Couldn't validate the form, please try again later"
)
const validationFailedWarningMessage = i18n.t(
    "Couldn't validate the form. This does not effect form completion!"
)
const completingFormFailedMessage = i18n.t(
    "Couldn't validate the form, please try again later"
)

function hasViolations(commentRequiredViolations, validationRuleViolations) {
    return (
        commentRequiredViolations.length ||
        Object.keys(validationRuleViolations).length
    )
}

function useOnCompleteWhenValidRequiredClick() {
    const [validate, setValidate] = useState(false)
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()
    const setRightHandPanel = useSetRightHandPanel()
    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    useValidationResult({
        enabled: validate,
        onError: (e) => {
            console.error(e)
            setValidate(false)
            showErrorAlert(validationFailedMessage)
        },
        onSuccess: ({ commentRequiredViolations, validationRuleViolations }) => {
            setValidate(false)

            // if the form is invalid, show the sidebar and show an
            // alert to the user
            if (
                hasViolations(
                    commentRequiredViolations,
                    validationRuleViolations
                )
            ) {
                setRightHandPanel(validationResultsSidebarId)
                showErrorAlert(i18n.t("The form can't be completed while invalid"))
            } else {
                // otherwise complete the form
                return setFormCompletion({ completed: true }).catch((e) => {
                    console.error(e)
                    showErrorAlert(e.message)
                })
            }
        }
    })

    return () => setValidate(true)
}

function useOnCompleteWhenValidNotRequiredClick() {
    const [validate, setValidate] = useState(false)
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()
    const setRightHandPanel = useSetRightHandPanel()
    const { show: showWarningAlert } = useAlert((message) => message, {
        warning: true,
    })
    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    useValidationResult({
        enabled: validate,
        onError: (e) => {
            console.error(e)
            setValidate(false)
            // For now this can fail "silently".
            // ES6 Promises don't have a mechanism for reporting
            // multiple promise failures and we def. want to notify the
            // user when form completion fails as well.
            // It should be enough to show a warning to the user
            showWarningAlert(validationFailedWarningMessage)
        },
        onSuccess: ({ commentRequiredViolations, validationRuleViolations }) => {
            setValidate(false)

            // if the form is invalid, show the sidebar and show an
            // alert to the user
            if (
                hasViolations(
                    commentRequiredViolations,
                    validationRuleViolations
                )
            ) {
                setRightHandPanel(validationResultsSidebarId)
            }
        }
    })

    return () => {
        setValidate(true)
        setFormCompletion({ completed: true }).catch(() => {
            showErrorAlert(completingFormFailedMessage)
        })
    }
}

function useOnCompleteWithoutValidationClick() {
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()
    return () => {
        setFormCompletion({ completed: true })
    }
}

export default function useOnCompleteCallback() {
    const { offline } = useConnectionStatus()
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const { validCompleteOnly } = dataSet
    const setFormCompletionMutationKey = useSetFormCompletionMutationKey()
    const isLoading = useIsMutating(setFormCompletionMutationKey)
    const cancelCompletionMutation = useImperativeCancelCompletionMutation()
    const onCompleteWhenValidRequiredClick =
        useOnCompleteWhenValidRequiredClick()
    const onCompleteWhenValidNotRequiredClick =
        useOnCompleteWhenValidNotRequiredClick()
    const onCompleteWithoutValidationClick =
        useOnCompleteWithoutValidationClick()

    return () => {
        if (isLoading) {
            cancelCompletionMutation()
        }

        if (isLoading && offline) {
            // No need to complete when the completion request
            // hasn't been sent yet due to being offline.
            // It's important to still perform the request online as we don't
            // know if the mutation actually reached the server already
        } else if (offline) {
            // When offline, we can't validate, so we simply complete the form
            onCompleteWithoutValidationClick()
        } else if (validCompleteOnly && !offline) {
            onCompleteWhenValidRequiredClick()
        } else {
            onCompleteWhenValidNotRequiredClick()
        }
    }
}
