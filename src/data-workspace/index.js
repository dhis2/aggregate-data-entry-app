import React from 'react'
import { DataWorkspace as SimpleDataWorkspace } from './data-workspace.js'
import { MetadataContextProvider } from './metadata-context.js'
//export const DataWorkspace = () => <SimpleDataWorkspace />
//export { default as DataWorkspace } from './data-workspace.js'

export const DataWorkspace = () => (
    <MetadataContextProvider>
        <SimpleDataWorkspace />
    </MetadataContextProvider>
)
