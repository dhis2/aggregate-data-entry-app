import i18n from '@dhis2/d2-i18n'
import { OrganisationUnitTree, SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import {
    useCategoryOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
} from '../use-context-selection.js'
import useDataSetOrgUnitPaths from './use-data-set-org-unit-paths.js'
import useOrgUnit from './use-organisation-unit.js'
import useUserOrgUnits from './use-user-org-units.js'

export default function OrganisationUnitSetSelectorBarItem() {
    const [orgUnitOpen, setOrgUnitOpen] = useState(false)
    const [dataSetId] = useDataSetId()
    const [, setOrgUnitId] = useOrgUnitId()
    const [, setCategoryOptionComboSelection] =
        useCategoryOptionComboSelection()
    const [expanded, setExpanded] = useState([])
    const handleExpand = ({ path }) => setExpanded([...expanded, path])
    const handleCollapse = ({ path }) =>
        setExpanded(expanded.filter((p) => p !== path))

    const { loadingOrgUnit, errorOrgUnit, orgUnit } = useOrgUnit()
    const { loadingUserOrgUnits, errorUserOrgUnits, userOrgUnits } =
        useUserOrgUnits()
    const {
        dataSetOrgUnitPaths,
        loadingDataSetOrgUnitPaths,
        errorDataSetOrgUnitPaths,
    } = useDataSetOrgUnitPaths()

    const selectorBarItemValue =
        loadingUserOrgUnits || loadingOrgUnit || loadingDataSetOrgUnitPaths
            ? i18n.t('Fetching organisation unit info')
            : errorOrgUnit || errorUserOrgUnits || errorDataSetOrgUnitPaths
            ? i18n.t('Error occurred while loading organisation unit info')
            : orgUnit?.displayName

    const selected = orgUnit ? [orgUnit.path] : []

    return (
        <SelectorBarItem
            disabled={!dataSetId}
            label={i18n.t('Organisation unit')}
            value={selectorBarItemValue}
            open={orgUnitOpen}
            setOpen={setOrgUnitOpen}
            noValueMessage={i18n.t('Choose a organisation unit')}
        >
            <div style={{ width: 400 }}>
                <OrganisationUnitTree
                    singleSelection
                    roots={userOrgUnits || []}
                    selected={selected}
                    expanded={expanded}
                    handleExpand={handleExpand}
                    handleCollapse={handleCollapse}
                    onChange={({ id }, e) => {
                        // Not sure why this is necessary, but when not done,
                        // it causes bugs in the UI
                        e.stopPropagation()
                        setOrgUnitId(id)
                        setOrgUnitOpen(false)
                        setCategoryOptionComboSelection([])
                    }}
                    filter={dataSetOrgUnitPaths || undefined}
                />
            </div>
        </SelectorBarItem>
    )
}
