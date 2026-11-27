import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MemoryRouter, useHistory, useLocation } from 'react-router-dom'
import { OuterComponents } from '../app/app-wrapper.jsx'
import LoadApp from '../app/load-app.jsx'
import { DataWorkspace } from '../data-workspace/index.js'
import {
    dataValueSetQueryKey,
    EmbeddedContext,
    selectors,
    useMetadata,
    withServerDefaults,
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
export const FollowSelection = ({ search, children }) => {
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

// values may come as numbers, e.g. a report's totals; fields expect strings
export const toHostDataValues = (dataValues) => ({
    ...dataValues,
    dataValues: dataValues.dataValues.map((dataValue) => ({
        ...dataValue,
        value:
            typeof dataValue.value === 'number'
                ? String(dataValue.value)
                : dataValue.value,
    })),
})

// props arrive as new objects with every message from the host, so the same
// values are only a change when their contents differ
const useStableByContents = (value) => {
    const contents = JSON.stringify(value)
    const current = useRef({ contents, value })
    if (current.current.contents !== contents) {
        current.current = { contents, value }
    }
    return current.current.value
}

// gives the shown form the host's new values
export const SyncHostValues = ({ dataValues }) => {
    const queryClient = useQueryClient()
    const previous = useRef(dataValues)

    useEffect(() => {
        if (previous.current !== dataValues) {
            previous.current = dataValues
            queryClient.setQueriesData(
                dataValueSetQueryKey.all,
                withServerDefaults(dataValues)
            )
        }
    }, [queryClient, dataValues])

    return null
}

SyncHostValues.propTypes = {
    dataValues: PropTypes.object.isRequired,
}

// the data workspace for other apps to embed, showing the values they pass
export const DataWorkspacePlugin = ({
    dataSetId,
    orgUnitId,
    periodId,
    dataValues,
}) => {
    const search = toSearch({ dataSetId, orgUnitId, periodId })
    const hostDataValues = useStableByContents(toHostDataValues(dataValues))
    const [Router] = useState(() => createRouter(`/${search}`))
    const embedded = useMemo(
        () => ({
            readOnly: true,
            dataValues: hostDataValues,
            // a report adds up the values of all attribute options
            allAttributeOptions: true,
        }),
        [hostDataValues]
    )

    return (
        <EmbeddedContext.Provider value={embedded}>
            <OuterComponents router={Router} persistQueries={false}>
                <SyncHostValues dataValues={hostDataValues} />
                <FollowSelection search={search}>
                    <LoadApp>
                        <CheckedDataWorkspace dataSetId={dataSetId} />
                    </LoadApp>
                </FollowSelection>
            </OuterComponents>
        </EmbeddedContext.Provider>
    )
}

const valuePropType = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

DataWorkspacePlugin.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    // shaped like a dataEntry/dataValues response
    dataValues: PropTypes.shape({
        dataValues: PropTypes.arrayOf(
            PropTypes.shape({
                categoryOptionCombo: PropTypes.string.isRequired,
                dataElement: PropTypes.string.isRequired,
                value: valuePropType,
            })
        ).isRequired,
    }).isRequired,
    orgUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
}
