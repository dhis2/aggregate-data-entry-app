import React from 'react'
import i18n from '../locales/index.js'
import { useLockedContext } from '../shared/index.js'

export default function FormExpiryInfo() {
    const {
        locked,
        lockStatus: { lockDate },
    } = useLockedContext()

    return (
        <>
            {!locked && lockDate && (
                <div>
                    {i18n.t('This form closes at {{-dateTime}}', {
                        dateTime: lockDate.toLocaleString(),
                    })}
                </div>
            )}
        </>
    )
}
