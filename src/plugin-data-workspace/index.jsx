import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { OuterComponents } from '../app/app-wrapper.jsx'
import useQueryClient from '../app/query-client/use-query-client.js'
import { DataWorkspace } from '../data-workspace/index.js'
import {
    dataValueSetQueryKey,
    useMetadata,
    useUserInfo,
} from '../shared/index.js'
import '../locales/index.js'

/**
 * The data workspace on its own, without context selection, sidebar or header
 * bar, for other apps to embed (e.g. a data set report showing its values as
 * they appear in the form).
 *
 * The workspace reads its selection from the URL, so the host's selection
 * becomes the initial entry of an in-memory router.
 *
 * Unlike the app, nothing here is persisted to IndexedDB: the plugin shares
 * the app's origin, and `dataValues` from a host are typically aggregates,
 * which the app must never read back as entered values.
 */

/* The app's LoadApp also prefetches every custom form for offline use. */
const Loader = ({ children }) => {
    const metadata = useMetadata()
    const userInfo = useUserInfo()

    if (metadata.isLoading || userInfo.isLoading) {
        return (
            <CenteredContent position="top">
                <CircularLoader />
            </CenteredContent>
        )
    }

    const error = metadata.error || userInfo.error
    if (error) {
        return (
            <NoticeBox error title={i18n.t('There was a problem loading')}>
                {error.message}
            </NoticeBox>
        )
    }

    return children
}

Loader.propTypes = {
    children: PropTypes.node,
}

/**
 * Values supplied by the host replace the `dataEntry/dataValues` request, for
 * every selection, so the workspace never fetches raw values of its own.
 */
const useHostDataValues = (queryClient, dataValues) => {
    if (dataValues) {
        queryClient.setQueryDefaults(dataValueSetQueryKey.all, {
            queryFn: () => ({ dataValues }),
        })
    }
}

const DataWorkspacePlugin = ({
    dataSetId,
    orgUnitId,
    periodId,
    dataValues,
    readOnly = false,
}) => {
    const queryClient = useQueryClient()
    useHostDataValues(queryClient, dataValues)

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
        <OuterComponents
            key={search}
            router={Router}
            queryClient={queryClient}
            persist={false}
            readOnly={readOnly}
        >
            <Loader>
                <DataWorkspace readOnly={readOnly} fitContent />
            </Loader>
        </OuterComponents>
    )
}

DataWorkspacePlugin.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    orgUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
    /** In the shape `dataEntry/dataValues` returns them */
    dataValues: PropTypes.arrayOf(
        PropTypes.shape({
            categoryOptionCombo: PropTypes.string.isRequired,
            dataElement: PropTypes.string.isRequired,
            value: PropTypes.string,
        })
    ),
    readOnly: PropTypes.bool,
}

export default DataWorkspacePlugin
