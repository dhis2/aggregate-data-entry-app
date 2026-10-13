import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { OuterComponents } from '../app/app-wrapper.jsx'
import LoadApp from '../app/load-app.jsx'
import { DataWorkspace } from '../data-workspace/index.js'
import LegacyCustomFormPlugin from '../plugin-legacy-custom-forms/index.jsx'

/*
 * SPIKE (DHIS2-22048): the data workspace on its own, for other apps to embed.
 * The workspace reads its selection from the URL, so the host's selection
 * becomes the initial entry of an in-memory router.
 */
const DataWorkspacePlugin = ({ dataSetId, orgUnitId, periodId }) => {
    const search = new URLSearchParams({
        dataSetId,
        orgUnitId,
        periodId,
    }).toString()

    const Router = useCallback(
        ({ children }) => (
            <MemoryRouter initialEntries={[`/?${search}`]}>
                {children}
            </MemoryRouter>
        ),
        [search]
    )

    return (
        <OuterComponents router={Router}>
            <LoadApp>
                <DataWorkspace />
            </LoadApp>
        </OuterComponents>
    )
}

DataWorkspacePlugin.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    orgUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
}

/*
 * An app has a single plugin entry point, already used by the legacy custom
 * forms plugin. Hosts ask for the data workspace with `pluginMode`; without
 * it, everything works as before.
 */
const PluginEntry = (props) =>
    props.pluginMode === 'DATA_WORKSPACE' ? (
        <DataWorkspacePlugin {...props} />
    ) : (
        <LegacyCustomFormPlugin {...props} />
    )

PluginEntry.propTypes = {
    pluginMode: PropTypes.oneOf(['DATA_WORKSPACE']),
}

export default PluginEntry
