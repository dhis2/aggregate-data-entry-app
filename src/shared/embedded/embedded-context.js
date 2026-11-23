import { createContext, useContext } from 'react'

// fields can't be edited and editing actions are hidden
export const ReadOnlyContext = createContext(false)

export const useIsReadOnly = () => useContext(ReadOnlyContext)

// values provided by an embedding app, shaped like a dataEntry/dataValues
// response; shown instead of fetching the stored values
export const HostDataValuesContext = createContext(undefined)

export const useHostDataValues = () => useContext(HostDataValuesContext)
