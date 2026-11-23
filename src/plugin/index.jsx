import PropTypes from 'prop-types'
import React from 'react'
import LegacyCustomFormPlugin from '../plugin-legacy-custom-forms/index.jsx'
import { DataWorkspacePlugin } from './data-workspace-plugin.jsx'
import { PLUGIN_MODES } from './plugin-modes.js'

/*
 * An app has a single plugin entry point. By default it shows the data
 * workspace, which other apps embed (e.g. the reports app), so they need no
 * special props. This app also uses it internally for custom forms that run
 * scripts (see custom-form.jsx), which ask for pluginMode="LEGACY_CUSTOM_FORM".
 * Once the platform supports several entry points, the legacy custom forms
 * can move to their own.
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
