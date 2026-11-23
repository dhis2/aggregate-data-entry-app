import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MemoryRouter, useHistory, useLocation } from 'react-router-dom'
import { ObjectParam } from 'use-query-params'
import { OuterComponents } from '../app/app-wrapper.jsx'
import LoadApp from '../app/load-app.jsx'
import { DataWorkspace } from '../data-workspace/index.js'
import {
    HostDataValuesContext,
    ReadOnlyContext,
    selectors,
    useIsValidSelection,
    useMetadata,
} from '../shared/index.js'
import styles from './data-workspace-plugin.module.css'
import '../locales/index.js'

// the URL search the top bar would set for the selection, which the
// workspace reads its selection from
export const toSearch = ({
    dataSetId,
    orgUnitId,
    periodId,
    attributeOptionComboSelection,
}) => {
    const params = new URLSearchParams({ dataSetId, orgUnitId, periodId })
    if (
        attributeOptionComboSelection &&
        Object.keys(attributeOptionComboSelection).length > 0
    ) {
        params.set(
            'attributeOptionComboSelection',
            ObjectParam.encode(attributeOptionComboSelection)
        )
    }
    return `?${params.toString()}`
}

const createRouter = (initialEntry) => {
    const PluginRouter = ({ children }) => (
        <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
    )
    PluginRouter.propTypes = { children: PropTypes.node }
    return PluginRouter
}

// follows the host's selection, and renders nothing until it has
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

const Message = ({ title, children }) => (
    <NoticeBox className={styles.message} title={title}>
        {children}
    </NoticeBox>
)

Message.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
}

/*
 * Without the top bar, nothing corrects a selection the workspace can't
 * show, so say why rather than showing the "Get started" screen.
 */
const CheckedDataWorkspace = ({ dataSetId }) => {
    const { data: metadata } = useMetadata()
    const isValidSelection = useIsValidSelection()

    if (!selectors.getDataSetById(metadata, dataSetId)) {
        return (
            <Message title={i18n.t('The data entry form is not available')}>
                {i18n.t(
                    'Data entry forms can only be shown for data sets you can enter data for.'
                )}
            </Message>
        )
    }
    if (!isValidSelection) {
        return (
            <Message title={i18n.t('The data entry form is not available')}>
                {i18n.t('Choose an option for each attribute category.')}
            </Message>
        )
    }
    return <DataWorkspace />
}

CheckedDataWorkspace.propTypes = {
    dataSetId: PropTypes.string.isRequired,
}

/*
 * Props arrive as new objects with every message from the host, so values
 * are compared by their contents. The form takes its values once per
 * selection, so it starts over (a new version) when they change for the same
 * one, e.g. a report with other filters.
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

/*
 * The data workspace on its own, for other apps to embed, e.g. the reports
 * app's data set report. It is always read-only. Without `dataValues`, it
 * shows the values stored for the selection; with them, it shows those
 * instead, e.g. a report's totals.
 */
export const DataWorkspacePlugin = ({
    dataSetId,
    orgUnitId,
    periodId,
    attributeOptionComboSelection,
    dataValues,
}) => {
    const search = toSearch({
        dataSetId,
        orgUnitId,
        periodId,
        attributeOptionComboSelection,
    })
    const hostValues = useHostValues(dataValues)
    // a stable router, started on the first selection
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
    orgUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
    // { [categoryId]: categoryOptionId }, one per attribute category; not
    // needed with dataValues
    attributeOptionComboSelection: PropTypes.objectOf(PropTypes.string),
    // shaped like a dataEntry/dataValues response; only `dataValues` is
    // required: [{ dataElement, categoryOptionCombo, value }]
    dataValues: PropTypes.shape({
        dataValues: PropTypes.arrayOf(
            PropTypes.shape({
                categoryOptionCombo: PropTypes.string.isRequired,
                dataElement: PropTypes.string.isRequired,
                value: PropTypes.string,
            })
        ),
    }),
}
