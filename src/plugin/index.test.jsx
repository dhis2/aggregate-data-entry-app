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
    it('shows the data workspace by default', () => {
        render(<PluginEntry dataSetId="ds" orgUnitId="ou" periodId="202401" />)
        expect(screen.getByText('data workspace')).toBeInTheDocument()
    })

    it('shows a legacy custom form in LEGACY_CUSTOM_FORM mode', () => {
        render(
            <PluginEntry pluginMode="LEGACY_CUSTOM_FORM" htmlCode="<p></p>" />
        )
        expect(screen.getByText('legacy custom form')).toBeInTheDocument()
    })
})
