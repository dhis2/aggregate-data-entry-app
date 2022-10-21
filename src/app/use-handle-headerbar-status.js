import { useOnlineStatusMessage } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useIsMutating } from '@tanstack/react-query'
import { useEffect } from 'react'

const UPDATE_DELAY = 2000

export const useHandleHeaderbarStatus = () => {
    const pendingMutations = useIsMutating()
    const { setOnlineStatusMessage } = useOnlineStatusMessage()
    useEffect(() => {
        // use a delay so message does not "flicker"
        const timeout = setTimeout(
            () => setOnlineStatusMessage(message),
            UPDATE_DELAY
        )
        const message = pendingMutations
            ? pendingMutations === 1
                ? i18n.t('{{pendingMutations}} change saved locally', {
                      pendingMutations,
                  })
                : i18n.t('{{pendingMutations}} changes saved locally', {
                      pendingMutations,
                  })
            : null

        //setOnlineStatusMessage(message)
        return () => {
            clearTimeout(timeout)
        }
    }, [pendingMutations, setOnlineStatusMessage])
}

export default useHandleHeaderbarStatus
