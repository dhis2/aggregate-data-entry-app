import { useContext } from 'react'
import CurrentItemContext from './current-item-context.js'

export default function useCurrentItemContext() {
    return useContext(CurrentItemContext)
}
