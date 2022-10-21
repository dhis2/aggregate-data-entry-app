import { useOnlineStatusMessage } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useIsMutating } from '@tanstack/react-query'
import { useEffect } from 'react'

// delaying from showing/hiding message
const DELAY_SHOW = 2000
// delay for updating number when shown
const DELAY_UPDATE = 200

export const useHandleHeaderbarStatus = () => {
    const pendingMutations = useIsMutating()
    const { onlineStatusMessage, setOnlineStatusMessage } =
        useOnlineStatusMessage()

    const didShowMessage = !!onlineStatusMessage
    useEffect(() => {
        const nextShowMessage = !!pendingMutations
        // use a shorter delay when updating, use longer when hide -> show
        const delay =
            didShowMessage !== nextShowMessage ? DELAY_SHOW : DELAY_UPDATE

        const message = pendingMutations
            ? pendingMutations === 1
                ? i18n.t('{{pendingMutations}} change saved locally', {
                      pendingMutations,
                  })
                : i18n.t('{{pendingMutations}} changes saved locally', {
                      pendingMutations,
                  })
            : null

        // use a delay so message does not "flicker"
        const timeout = setTimeout(() => setOnlineStatusMessage(message), delay)

        return () => {
            clearTimeout(timeout)
        }
    }, [pendingMutations, didShowMessage, setOnlineStatusMessage])
}

export default useHandleHeaderbarStatus
