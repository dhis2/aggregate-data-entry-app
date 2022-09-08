import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Layer, Center, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    useDataValueSet,
    useSetFormCompletionMutation,
} from '../shared/index.js'
import useOnCompleteCallback from './use-on-complete-callback.js'

const incompletingFormFailedMessage = i18n.t(
    "Couldn't incomplete the form, please try again later"
)

// @TODO: Get the "isComplete" value from some response?
// @TODO: Optimistically update the source of the "isComplete" value
export default function CompleteButton({ disabled }) {
    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    const dataValueSet = useDataValueSet()
    const [isLoading, setIsLoading] = useState(false)
    // `mutate` doesn't return a promise, `mutateAsync` does
    const { mutateAsync: setFormCompletion } = useSetFormCompletionMutation()

    const onCompleteClick = useOnCompleteCallback(setIsLoading)
    const onIncompleteClick = function onIncompleteClick() {
        console.log('> foobar!')
        setFormCompletion({ variables: { completed: false } })
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
            <Button disabled={disabled} onClick={onClick}>
                {label}
            </Button>

            {isLoading && (
                <Layer translucent>
                    <Center>
                        <CircularLoader />
                    </Center>
                </Layer>
            )}
        </>
    )
}

CompleteButton.propTypes = {
    disabled: PropTypes.bool,
}
