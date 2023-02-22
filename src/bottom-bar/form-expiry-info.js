import React from 'react'
import i18n from '../locales/index.js'
import { useLockedContext, usePeriod, usePeriodId } from '../shared/index.js'

export default function FormExpiryInfo() {
    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)
    console.log({ selectedPeriod })
    const {
        locked,
        lockStatus: { lockDate },
    } = useLockedContext()

    console.log({ locked, lockDate })

    return (
        <>
            {!locked && lockDate && (
                <div>
                    {i18n.t('This form closes at {{dateTime}}', {
                        dateTime: lockDate.toUTCString(),
                    })}
                </div>
            )}
        </>
    )
}
