import { useRef, useEffect } from 'react'

// This is needed if the cleanup-effect depends on a variable
// or else the variable might be stale when cleanup-function is run
export const useComponentWillUnmount = (callback, deps = []) => {
    const willUnmount = useRef(false)

    useEffect(() => {
        return () => {
            willUnmount.current = true
        }
    }, [])

    useEffect(() => {
        return () => {
            if (willUnmount.current) {
                callback()
            }
        }
        // note callback is not in dep-array to support array-functions
        // and prevent it from running every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
