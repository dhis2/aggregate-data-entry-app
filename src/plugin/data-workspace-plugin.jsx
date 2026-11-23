import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MemoryRouter, useHistory, useLocation } from 'react-router-dom'
import { OuterComponents } from '../app/app-wrapper.jsx'
import LoadApp from '../app/load-app.jsx'
import { DataWorkspace } from '../data-workspace/index.js'
import {
    HostDataValuesContext,
    ReadOnlyContext,
    selectors,
    useMetadata,
} from '../shared/index.js'
import styles from './data-workspace-plugin.module.css'
import '../locales/index.js'

// the workspace reads its selection from the URL, as the top bar sets it
export const toSearch = ({ dataSetId, orgUnitId, periodId }) =>
    `?${new URLSearchParams({ dataSetId, orgUnitId, periodId })}`

const createRouter = (initialEntry) => {
    const PluginRouter = ({ children }) => (
        <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
    )
    PluginRouter.propTypes = { children: PropTypes.node }
    return PluginRouter
}

// renders nothing until the URL has the host's current selection
const FollowSelection = ({ search, children }) => {
    const history = useHistory()
    const location = useLocation()
    const isCurrent = location.search === search

    useEffect(() => {
        if (!isCurrent) {
            history.replace({ pathname: '/', search })
        }
    }, [isCurrent, history, search])

    return isCurrent ? children : null
}

FollowSelection.propTypes = {
    search: PropTypes.string.isRequired,
    children: PropTypes.node,
}

// dataEntry/metadata only has the data sets the user can enter data for
const CheckedDataWorkspace = ({ dataSetId }) => {
    const { data: metadata } = useMetadata()

    if (!selectors.getDataSetById(metadata, dataSetId)) {
        return (
            <NoticeBox
                className={styles.message}
                title={i18n.t('The data entry form is not available')}
            >
                {i18n.t(
                    'Data entry forms can only be shown for data sets you can enter data for.'
                )}
            </NoticeBox>
        )
    }
    return <DataWorkspace />
}

CheckedDataWorkspace.propTypes = {
    dataSetId: PropTypes.string.isRequired,
}

/*
 * Props arrive as new objects with every message from the host, so values are
 * compared by contents. The form reads its values once per selection, so a
 * new version remounts it when they change for the same selection.
 */
const useHostValues = (dataValues) => {
    const contents = useMemo(() => JSON.stringify(dataValues), [dataValues])
    const current = useRef({ contents, values: dataValues, version: 0 })
    if (current.current.contents !== contents) {
        current.current = {
            contents,
            values: dataValues,
            version: current.current.version + 1,
        }
    }
    return current.current
}

// the data workspace for other apps to embed, showing the values they pass
export const DataWorkspacePlugin = ({
    dataSetId,
    orgUnitId,
    periodId,
    dataValues,
}) => {
    const search = toSearch({ dataSetId, orgUnitId, periodId })
    const hostValues = useHostValues(dataValues)
    const [Router] = useState(() => createRouter(`/${search}`))

    return (
        <ReadOnlyContext.Provider value={true}>
            <HostDataValuesContext.Provider value={hostValues.values}>
                <OuterComponents router={Router} persistQueries={false}>
                    <FollowSelection search={search}>
                        <LoadApp>
                            <CheckedDataWorkspace
                                key={hostValues.version}
                                dataSetId={dataSetId}
                            />
                        </LoadApp>
                    </FollowSelection>
                </OuterComponents>
            </HostDataValuesContext.Provider>
        </ReadOnlyContext.Provider>
    )
}

DataWorkspacePlugin.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    // shaped like a dataEntry/dataValues response
    dataValues: PropTypes.shape({
        dataValues: PropTypes.arrayOf(
            PropTypes.shape({
                categoryOptionCombo: PropTypes.string.isRequired,
                dataElement: PropTypes.string.isRequired,
                value: PropTypes.string,
            })
        ).isRequired,
    }).isRequired,
    orgUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
}
