import React from 'react'
import { useRightHandPanelContext } from '../../right-hand-panel/index.js'
import { useHighlightedFieldIdContext } from '../../shared/index.js'

const useIsCellHighlighted = ({ dataElemenId, categoryOptionComboId }) => {
    const { id } = useRightHandPanelContext()
    const rightHandPanelOpen = !!id

    const { item } = useHighlightedFieldIdContext()

    return (
        rightHandPanelOpen &&
        item?.de?.id === dataElemenId &&
        item?.coc?.id === categoryOptionComboId
    )
}

export default useIsCellHighlighted
