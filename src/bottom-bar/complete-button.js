import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    useConnectionStatus,
    useDataValueSet,
    useSetFormCompletionMutation,
} from '../shared/index.js'
import useOnCompleteCallback from './use-on-complete-callback.js'

const incompletingFormFailedMessage = i18n.t(
    "Couldn't incomplete the form, please try again later"
)

export default function CompleteButton({ disabled }) {
    const { offline } = useConnectionStatus()
    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    const dataValueSet = useDataValueSet()
    const [isLoading, setIsLoading] = useState(false)
    // `mutate` doesn't return a promise, `mutateAsync` does
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()

    const onCompleteClick = useOnCompleteCallback(setIsLoading)
    const onIncompleteClick = function onIncompleteClick() {
        !offline && setIsLoading(true)
        setFormCompletion({ completed: false })
            .catch(() => showErrorAlert(incompletingFormFailedMessage))
            .finally(() => setIsLoading(false))
    }

    // We don't want to hide the button while the mutation is refetching,
    // so as long as there's data (and stale data), we'll show the button
    if (!dataValueSet.data) {
        return null
    }

    const isComplete = dataValueSet.data.completeStatus.complete
    const onClick = isComplete ? onIncompleteClick : onCompleteClick
    const label = isComplete
        ? i18n.t('Mark incomplete')
        : i18n.t('Mark complete')

    return (
        <>
            <Button
                disabled={disabled}
                onClick={onClick}
                icon={isLoading ? <CircularLoader small /> : null}
            >
                {label}
            </Button>
        </>
    )
}

CompleteButton.propTypes = {
    disabled: PropTypes.bool,
}
