import PropTypes from 'prop-types'
import React from 'react'
import LegacyCustomFormPlugin from '../plugin-legacy-custom-forms/index.jsx'
import { DataWorkspacePlugin } from './data-workspace-plugin.jsx'
import { PLUGIN_MODES } from './plugin-modes.js'

/*
 * An app has a single plugin entry point. Other apps embed the data
 * workspace, the default. Legacy custom forms are internal (custom-form.jsx)
 * and can move to their own entry point once the platform supports several.
 */
const PluginEntry = (props) =>
    props.pluginMode === PLUGIN_MODES.LEGACY_CUSTOM_FORM ? (
        <LegacyCustomFormPlugin {...props} />
    ) : (
        <DataWorkspacePlugin {...props} />
    )

PluginEntry.propTypes = {
    pluginMode: PropTypes.oneOf(Object.values(PLUGIN_MODES)),
}

export default PluginEntry
