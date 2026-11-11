import { createContext, useContext } from 'react'

/*
 * True when the form is only shown, never edited, e.g. when another app
 * embeds the data workspace as a report. Fields then behave as if the user
 * couldn't edit them, and the editing actions are hidden.
 */
export const ReadOnlyContext = createContext(false)

export const useIsReadOnly = () => useContext(ReadOnlyContext)
