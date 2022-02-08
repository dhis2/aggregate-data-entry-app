import { useContext } from 'react'
import CurrentItemContext from './context.js'

const useCurrentItem = () => useContext(CurrentItemContext)

export default useCurrentItem
