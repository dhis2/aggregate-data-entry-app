import { useCallback, useEffect, useRef, useState } from 'react'

/** Copied from https://usehooks.com/useDebounce/ */
export function useDebouncedValue(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return debouncedValue
}

/*
 * If this component ever causes issues,
 * consider using https://github.com/xnimorz/use-debounce
 */
export function useDebounce(callback, delay) {
    const timeoutIdRef = useRef(null)

    return useCallback(
        (...args) => {
            clearTimeout(timeoutIdRef.current)
            timeoutIdRef.current = setTimeout(() => callback(...args), delay)
        },
        [callback, delay]
    )
}
