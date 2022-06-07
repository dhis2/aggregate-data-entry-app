import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRightHandPanelContext } from '../right-hand-panel/index.js'

export default function useCloseRightHandPanelOnSelectionChange() {
    const rightHandPanel = useRightHandPanelContext()
    const searchParams = useParams()

    useEffect(
        () => {
            rightHandPanel.id && rightHandPanel.hide()
        },
        // contextSelection is part of the dependency array as we need to hide
        // the sidebar when the selection changes. There's no need to use the
        // context selection in the useEffect though
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchParams]
    )
}
