import { createContext, useContext } from 'react'

// the embedding app has cached the metadata and data values
export const HostDataContext = createContext(false)

export const useIsDataFromHost = () => useContext(HostDataContext)
