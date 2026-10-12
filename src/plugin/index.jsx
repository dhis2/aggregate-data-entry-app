import PropTypes from 'prop-types'
import React from 'react'
import DataWorkspacePlugin from '../plugin-data-workspace/index.jsx'
import LegacyCustomFormPlugin from '../plugin-legacy-custom-forms/index.jsx'

export const PLUGIN_MODES = Object.freeze({
    DATA_WORKSPACE: 'DATA_WORKSPACE',
})

/**
 * An app has a single plugin entry point, shared here by two plugins. Hosts
 * pick the data workspace with `pluginMode`; without it, the props are the
 * legacy custom forms plugin's, as used by the app itself.
 */
const PluginEntry = (props) =>
    props.pluginMode === PLUGIN_MODES.DATA_WORKSPACE ? (
        <DataWorkspacePlugin {...props} />
    ) : (
        <LegacyCustomFormPlugin {...props} />
    )

PluginEntry.propTypes = {
    pluginMode: PropTypes.oneOf(Object.values(PLUGIN_MODES)),
}

export default PluginEntry
