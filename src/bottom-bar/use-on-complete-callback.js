import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useSetRightHandPanel } from '../right-hand-panel/index.js'
import {
    selectors,
    useConnectionStatus,
    useDataSetId,
    useImperativeValidate,
    useMetadata,
    useSetFormCompletionMutation,
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
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()
    const setRightHandPanel = useSetRightHandPanel()
    const validate = useImperativeValidate()

    return () =>
        validate()
            // Show this alert message and skip the next "then" block
            .catch((e) => {
                console.error(e)
                throw new Error(validationFailedMessage)
            })
            // the validation request succeeded
            .then(({ commentRequiredViolations, validationRuleViolations }) => {
                // if the form is invalid, show the sidebar and show an
                // alert to the user
                if (hasViolations(
                    commentRequiredViolations,
                    validationRuleViolations
                )) {
                    setRightHandPanel(validationResultsSidebarId)
                    return Promise.reject(
                        new Error(
                            i18n.t("The form can't be completed while invalid")
                        )
                    )
                }
                // otherwise complete the form
                else {
                    return setFormCompletion({ completed: true }).catch((e) => {
                        console.error(e)
                        throw new Error(completingFormFailedMessage)
                    })
                }
            })
}

function useOnCompleteWhenValidNotRequiredClick() {
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()
    const setRightHandPanel = useSetRightHandPanel()
    const validate = useImperativeValidate()
    const { show: showWarningAlert } = useAlert((message) => message, {
        warning: true,
    })

    return () => {
        return Promise.all([
            validate()
                .then(({ commentRequiredViolations, validationRuleViolations }) => {
                    if (hasViolations(
                        commentRequiredViolations,
                        validationRuleViolations
                    )) {
                        setRightHandPanel(validationResultsSidebarId)
                    }
                })
                .catch((e) => {
                    console.error(e)
                    // For now this can fail "silently".
                    // ES6 Promises don't have a mechanism for reporting
                    // multiple promise failures and we def. want to notify the
                    // user when form completion fails as well.
                    // It should be enough to show a warning to the user
                    showWarningAlert(validationFailedWarningMessage)
                }),
            setFormCompletion({ completed: true }).catch(() => {
                throw new Error(completingFormFailedMessage)
            }),
        ])
    }
}

function useOnCompleteWithoutValidationClick() {
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()
    return () => setFormCompletion({ completed: true })
}

export default function useOnCompleteCallback(setIsLoading) {
    const { offline } = useConnectionStatus()
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const { validCompleteOnly } = dataSet
    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })
    const onCompleteWhenValidRequiredClick =
        useOnCompleteWhenValidRequiredClick()
    const onCompleteWhenValidNotRequiredClick =
        useOnCompleteWhenValidNotRequiredClick()
    const onCompleteWithoutValidationClick =
        useOnCompleteWithoutValidationClick()

    return () => {
        if (!offline) {
            // we don't need to show a loading spinner when offline
            setIsLoading(true)
        }

        let promise
        if (offline) {
            // When offline, we can't validate, so we simply complete the form
            promise = onCompleteWithoutValidationClick()
        } else if (validCompleteOnly && !offline) {
            promise = onCompleteWhenValidRequiredClick()
        } else {
            promise = onCompleteWhenValidNotRequiredClick()
        }

        return promise
            // this will eventually catch any error thrown and display the error message
            .catch((e) => showErrorAlert(e.message))
            .finally(() => setIsLoading(false))
    }
}
