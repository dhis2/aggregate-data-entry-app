import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useSetRightHandPanel } from '../right-hand-panel/index.js'
import {
    selectors,
    useDataSetId,
    useImperativeValidate,
    useMetadata,
    useSetFormCompletionMutation,
    validationResultsSidebarId,
} from '../shared/index.js'

const validationFailedMessage = i18n.t(
    "Couldn't validate the form, please try again later"
)
const completingFormFailedMessage = i18n.t(
    "Couldn't validate the form, please try again later"
)

function useOnCompleteWhenValidRequiredClick(setIsLoading) {
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()
    const setRightHandPanel = useSetRightHandPanel()
    const validate = useImperativeValidate()
    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    return () =>
        validate()
            // Show this alert message and skip the next "then" block
            .catch(() => {
                throw new Error(validationFailedMessage)
            })
            // the validation request succeeded
            .then((data) => {
                // if the form is invalid, show the sidebar and show an
                // alert to the user
                if (
                    data.commentRequiredViolations.length ||
                    Object.keys(data.validationRuleViolations).length
                ) {
                    setRightHandPanel(validationResultsSidebarId)
                    return Promise.reject(
                        new Error(
                            i18n.t("The form can't completed while invalid")
                        )
                    )
                }
                // otherwise complete the form
                else {
                    return setFormCompletion({
                        variables: { completed: true },
                    }).catch(() => {
                        throw new Error(completingFormFailedMessage)
                    })
                }
            })
            // this will eventually catch any error thrown and display the error message
            .catch((e) => showErrorAlert(e.message))
            .finally(() => setIsLoading(false))
}

function useOnCompleteWhenValidNotRequiredClick(setIsLoading) {
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()
    const setRightHandPanel = useSetRightHandPanel()
    const validate = useImperativeValidate()
    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    return () => {
        return Promise.all([
            validate()
                .then((data) => {
                    if (
                        data.commentRequiredViolations.length ||
                        Object.keys(data.validationRuleViolations).length
                    ) {
                        setRightHandPanel(validationResultsSidebarId)
                    }
                })
                .catch(() => {
                    throw new Error(validationFailedMessage)
                }),
            setFormCompletion({ variables: { completed: true } }).catch(() => {
                throw new Error(completingFormFailedMessage)
            }),
        ])
            .catch((e) => showErrorAlert(e.message))
            .finally(() => setIsLoading(false))
    }
}

export default function useOnCompleteCallback(setIsLoading) {
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const { validCompleteOnly } = dataSet
    const onCompleteWhenValidRequiredClick =
        useOnCompleteWhenValidRequiredClick(setIsLoading)
    const onCompleteWhenValidNotRequiredClick =
        useOnCompleteWhenValidNotRequiredClick(setIsLoading)

    return () => {
        setIsLoading(true)
        return validCompleteOnly
            ? onCompleteWhenValidRequiredClick()
            : onCompleteWhenValidNotRequiredClick()
    }
}
