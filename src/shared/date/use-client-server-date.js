import i18n from '@dhis2/d2-i18n'
import { useCallback, useMemo, useState } from 'react'
import { getCurrentDate } from '../fixed-periods/index.js'
import useClientServerDateUtils from './use-client-server-date-utils.js'

export default function useClientServerDate({
    clientDate: clientDateInput,
    serverDate: serverDateInput,
} = {}) {
    if (clientDateInput && serverDateInput) {
        throw new Error(
            '`useClientServerDate` does not accept both a client and a server date'
        )
    }

    const { fromClientDate, fromServerDate } = useClientServerDateUtils()

    const [clientServerDate, setClientServerDate] = useState(() => {
        if (clientDateInput) {
            return fromClientDate(clientDateInput)
        }

        if (serverDateInput) {
            return fromServerDate(serverDateInput)
        }

        return fromClientDate(getCurrentDate())
    })

    const { clientDate, serverDate } = clientServerDate

    const setClientDate = useCallback(
        (newClientDate) => {
            if (serverDateInput) {
                throw new Error(
                    i18n.t(
                        "You can't set a client date when having passed a server date to the hook"
                    )
                )
            }

            setClientServerDate(fromClientDate(newClientDate))
        },
        [fromClientDate, serverDateInput]
    )

    const setServerDate = useCallback(
        (newServerDate) => {
            if (clientDateInput) {
                throw new Error(
                    i18n.t(
                        "You can't set a server date when having passed a client date to the hook"
                    )
                )
            }

            setClientServerDate(fromServerDate(newServerDate))
        },
        [fromServerDate, clientDateInput]
    )

    return useMemo(
        () => ({ clientDate, serverDate, setClientDate, setServerDate }),
        [setClientDate, setServerDate, clientDate, serverDate]
    )
}
