import i18n from '@dhis2/d2-i18n'
import { Tag, IconError16, IconCheckmarkCircle16 } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import React from 'react'

const MutationIndicator = () => {
    const pendingMutations = useIsMutating()
    const message = pendingMutations
        ? pendingMutations === 1
            ? i18n.t('There is {{pendingMutations}} pending change.', {
                  pendingMutations,
              })
            : i18n.t('There are {{pendingMutations}} pending changes.', {
                  pendingMutations,
              })
        : i18n.t('Synced')

    return (
        <Tag
            icon={
                pendingMutations ? <IconError16 /> : <IconCheckmarkCircle16 />
            }
        >
            {message}
        </Tag>
    )
}

export default MutationIndicator
