import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ObjectParam } from 'use-query-params'
import { OuterComponents } from '../app/app-wrapper.jsx'
import LoadApp from '../app/load-app.jsx'
import { DataWorkspace } from '../data-workspace/index.js'
import LegacyCustomFormPlugin from '../plugin-legacy-custom-forms/index.jsx'
import {
    selectors,
    useContextSelection,
    useMetadata,
    useOrgUnit,
} from '../shared/index.js'
import { HostData } from './host-data.jsx'
import styles from './plugin.module.css'

/*
 * Without the top bar, nothing picks or corrects the attribute options, so
 * check the host's choice the same way the top bar's attribute selector does
 * and say what's wrong, rather than falling back to the "Get started" screen.
 */
const useAttributeOptionsMessage = () => {
    const { data: metadata } = useMetadata()
    const [{ dataSetId, orgUnitId, periodId, attributeOptionComboSelection }] =
        useContextSelection()
    const { data: orgUnitData } = useOrgUnit()
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    const categoryCombo = selectors.getCategoryComboByDataSetId(
        metadata,
        dataSetId
    )
    if (!categoryCombo || categoryCombo.isDefault) {
        return ''
    }

    const categories =
        selectors.getCategoriesWithOptionsWithinPeriodWithOrgUnit(
            metadata,
            dataSetId,
            periodId,
            orgUnitId,
            orgUnitData?.path,
            calendar
        )
    const names = (list) =>
        list.map(({ displayName }) => displayName).join(', ')

    const withoutOptions = categories.filter(
        ({ categoryOptions }) => categoryOptions.length === 0
    )
    if (withoutOptions.length > 0) {
        return i18n.t(
            'Some categories have no valid options for the selected period or organisation unit ({{categories}})',
            { categories: names(withoutOptions) }
        )
    }

    const notChosen = categories.filter(
        ({ id }) => !attributeOptionComboSelection[id]
    )
    if (notChosen.length > 0) {
        return i18n.t('Choose an option for: {{categories}}', {
            categories: names(notChosen),
        })
    }

    const notValid = categories.filter(
        ({ id, categoryOptions }) =>
            !categoryOptions.some(
                (option) => option.id === attributeOptionComboSelection[id]
            )
    )
    if (notValid.length > 0) {
        return i18n.t(
            'The chosen option is not valid for the selected period or organisation unit ({{categories}})',
            { categories: names(notValid) }
        )
    }

    return ''
}

const CheckedDataWorkspace = () => {
    const message = useAttributeOptionsMessage()
    if (message) {
        return (
            <NoticeBox
                className={styles.message}
                title={i18n.t('The current selection does not have a form')}
            >
                {message}
            </NoticeBox>
        )
    }
    return <DataWorkspace />
}

/*
 * SPIKE (DHIS2-22048): the data workspace on its own, for other apps to embed.
 * The workspace reads its selection from the URL, so the host's selection
 * becomes the initial entry of an in-memory router, with the same parameters
 * the top bar sets.
 */
const DataWorkspacePlugin = ({
    dataSetId,
    orgUnitId,
    periodId,
    attributeOptionComboSelection,
    sectionFilter,
    readOnly,
    metadata,
    dataValues,
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
    if (sectionFilter) {
        params.set('sectionFilter', sectionFilter)
    }
    const search = params.toString()
    // props arrive as new objects with every update; search encodes them
    const selection = useMemo(
        () => ({
            dataSetId,
            orgUnitId,
            periodId,
            attributeOptionComboSelection,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search]
    )

    const Router = useCallback(
        ({ children }) => (
            <MemoryRouter initialEntries={[`/?${search}`]}>
                {children}
            </MemoryRouter>
        ),
        [search]
    )

    return (
        <OuterComponents router={Router} readOnly={Boolean(readOnly)}>
            <HostData
                metadata={metadata}
                dataValues={dataValues}
                selection={selection}
            >
                <LoadApp>
                    <CheckedDataWorkspace />
                </LoadApp>
            </HostData>
        </OuterComponents>
    )
}

DataWorkspacePlugin.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    orgUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
    // { [categoryId]: categoryOptionId }, one per attribute category
    attributeOptionComboSelection: PropTypes.objectOf(PropTypes.string),
    // raw /api/dataEntry/dataValues and /api/dataEntry/metadata responses
    dataValues: PropTypes.object,
    metadata: PropTypes.object,
    readOnly: PropTypes.bool,
    sectionFilter: PropTypes.string,
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
