import PropTypes from 'prop-types'
import React from 'react'
import LegacyCustomFormPlugin from '../plugin-legacy-custom-forms/index.jsx'
import { DataWorkspacePlugin } from './data-workspace-plugin.jsx'

export const PLUGIN_MODES = {
    DATA_WORKSPACE: 'DATA_WORKSPACE',
}

/*
 * An app has a single plugin entry point. The data entry app uses it for
 * legacy custom forms (see custom-form.jsx), which pass no `pluginMode`.
 * Other apps embed the data workspace with pluginMode="DATA_WORKSPACE".
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
