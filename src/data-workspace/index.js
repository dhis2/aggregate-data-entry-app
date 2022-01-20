import React from 'react'
import { MetadataContextProvider } from '../metadata/index.js'
import { DataWorkspace as SimpleDataWorkspace } from './data-workspace.js'

export const DataWorkspace = () => (
    <MetadataContextProvider>
        <SimpleDataWorkspace />
    </MetadataContextProvider>
)
