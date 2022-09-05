import { useContext } from 'react'
import FormChangedSincePanelOpenedContext from './form-changed-since-panel-opened-context.js'

export default function useFormChangedSincePanelOpenedContext() {
    return useContext(FormChangedSincePanelOpenedContext)
}
