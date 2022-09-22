import { useContext, createContext } from 'react'

const PrintContext = createContext()

export default PrintContext

export function usePrintableArea() {
    const context = useContext(PrintContext)
    if (context === undefined) {
        throw new Error(
            'usePrintableArea must be used within a PrintContextProvider'
        )
    }
    return context
}
