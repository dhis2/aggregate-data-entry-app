import { render, screen } from '@testing-library/react'
import React from 'react'
import PluginEntry from './index.jsx'

jest.mock('../plugin-legacy-custom-forms/index.jsx', () => ({
    __esModule: true,
    default: () => <p>legacy custom form</p>,
}))

jest.mock('./data-workspace-plugin.jsx', () => ({
    DataWorkspacePlugin: () => <p>data workspace</p>,
}))

describe('PluginEntry', () => {
    it('shows a legacy custom form by default', () => {
        render(<PluginEntry htmlCode="<p></p>" />)
        expect(screen.getByText('legacy custom form')).toBeInTheDocument()
    })

    it('shows the data workspace in DATA_WORKSPACE mode', () => {
        render(<PluginEntry pluginMode="DATA_WORKSPACE" />)
        expect(screen.getByText('data workspace')).toBeInTheDocument()
    })
})
