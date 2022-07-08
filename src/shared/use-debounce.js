import { useEffect, useState } from 'react'

/** Copied from https://usehooks.com/useDebounce/ */
export function useDebouncedValue(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return debouncedValue
}

export function useDebounceCallback(value, cb, delay = 200) {
    const debouncedValue = useDebounce(value, delay)

    useEffect(() => {
        cb(debouncedValue)
    }, [debouncedValue, cb])
}
