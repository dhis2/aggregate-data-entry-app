import { render } from '@testing-library/react'
import React from 'react'
import PluginEntry, { PLUGIN_MODES } from './index.jsx'

jest.mock('../plugin-data-workspace/index.jsx', () => ({
    __esModule: true,
    default: () => <div>data workspace plugin</div>,
}))

jest.mock('../plugin-legacy-custom-forms/index.jsx', () => ({
    __esModule: true,
    default: () => <div>legacy custom form plugin</div>,
}))

describe('PluginEntry', () => {
    it('renders the data workspace plugin when asked for it', () => {
        const { getByText } = render(
            <PluginEntry pluginMode={PLUGIN_MODES.DATA_WORKSPACE} />
        )

        expect(getByText('data workspace plugin')).toBeInTheDocument()
    })

    it('renders the legacy custom form plugin by default', () => {
        const { getByText } = render(<PluginEntry htmlCode="<p></p>" />)

        expect(getByText('legacy custom form plugin')).toBeInTheDocument()
    })
})
