import { useMemo, useState } from 'react'
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
    const [{ clientDate, serverDate }] = useState(() => {
        if (serverDateInput) {
            return fromServerDate(serverDateInput)
        }

        return fromClientDate(
            clientDateInput ? clientDateInput : getCurrentDate()
        )
    })

    return useMemo(() => ({ clientDate, serverDate }), [clientDate, serverDate])
}
