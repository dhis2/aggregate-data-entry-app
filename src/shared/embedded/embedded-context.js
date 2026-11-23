import { createContext, useContext } from 'react'

/*
 * Set when another app embeds the data workspace, e.g. the reports app
 * showing a data set report as its data entry form.
 */

// the form is only shown, never edited: fields behave as if the user couldn't
// edit them, and the editing actions are hidden
export const ReadOnlyContext = createContext(false)

export const useIsReadOnly = () => useContext(ReadOnlyContext)

// the values to show, shaped like a dataEntry/dataValues response, when the
// embedding app provides them rather than the workspace fetching them. These
// can be aggregates (e.g. over org units or attribute options), so they are
// always shown read-only
export const HostDataValuesContext = createContext(undefined)

export const useHostDataValues = () => useContext(HostDataValuesContext)
