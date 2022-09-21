import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import React from 'react'
import {
    useConnectionStatus,
    useDataValueSet,
    useSetFormCompletionMutation,
    useSetFormCompletionMutationKey,
    useImperativeCancelCompletionMutation,
} from '../shared/index.js'
import useOnCompleteCallback from './use-on-complete-callback.js'

const incompletingFormFailedMessage = i18n.t(
    "Couldn't incomplete the form, please try again later"
)

export default function CompleteButton({ disabled }) {
    const { offline } = useConnectionStatus()
    const setFormCompletionMutationKey = useSetFormCompletionMutationKey()
    const isLoading = useIsMutating(setFormCompletionMutationKey)
    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    const dataValueSet = useDataValueSet()
    // `mutate` doesn't return a promise, `mutateAsync` does
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()
    const cancelCompletionMutation = useImperativeCancelCompletionMutation()

    const onCompleteClick = useOnCompleteCallback()
    const onIncompleteClick = function onIncompleteClick() {
        if (isLoading) {
            cancelCompletionMutation()
        }

        if (isLoading && offline) {
            // There's no need to incomplete the form when it hasn't been
            // completed yet. It's important to still perform the request
            // online as we don't know if the mutation actually reached the server
            // already
            return
        }

        setFormCompletion({ completed: false }).catch(() =>
            showErrorAlert(incompletingFormFailedMessage)
        )
    }

    // We don't want to hide the button while the mutation is refetching,
    // so as long as there's data (and stale data), we'll show the button
    if (!dataValueSet.data) {
        return null
    }

    const isComplete = dataValueSet.data.completeStatus?.complete
    const onClick = isComplete ? onIncompleteClick : onCompleteClick
    const label = isComplete
        ? i18n.t('Mark incomplete')
        : i18n.t('Mark complete')

    return (
        <>
            <Button disabled={disabled} onClick={onClick}>
                {label}
            </Button>
        </>
    )
}

CompleteButton.propTypes = {
    disabled: PropTypes.bool,
}
