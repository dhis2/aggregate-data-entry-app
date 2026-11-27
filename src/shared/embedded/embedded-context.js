import { useMutation } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

/*
 * Set when another app embeds the data workspace:
 * - readOnly: fields can't be edited, editing actions are hidden and
 *   nothing is saved
 * - dataValues: values to show instead of the stored ones, shaped like a
 *   dataEntry/dataValues response
 * - allAttributeOptions: the values cover all attribute options (e.g. a
 *   report's totals), so none needs choosing
 */
export const EmbeddedContext = createContext({})

export const useIsReadOnly = () => Boolean(useContext(EmbeddedContext).readOnly)

export const useHostDataValues = () => useContext(EmbeddedContext).dataValues

export const useShowsAllAttributeOptions = () =>
    Boolean(useContext(EmbeddedContext).allAttributeOptions)

// useMutation for anything that writes: a read-only form never sends it
export const useWriteMutation = (mutationFn, options) => {
    const readOnly = useIsReadOnly()
    const mutation = useMutation(mutationFn, options)

    if (readOnly) {
        return {
            ...mutation,
            mutate: () => {},
            mutateAsync: () => Promise.resolve(),
        }
    }
    return mutation
}
