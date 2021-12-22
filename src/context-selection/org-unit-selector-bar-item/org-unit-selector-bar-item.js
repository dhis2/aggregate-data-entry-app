import i18n from '@dhis2/d2-i18n'
import { OrganisationUnitTree, SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import {
    useCategoryOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
} from '../use-context-selection.js'
import useDataSetOrgUnitPaths from './use-data-set-org-unit-paths.js'
import useExpandedState from './use-expanded-state.js'
import useOrgUnit from './use-organisation-unit.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import useUserOrgUnits from './use-user-org-units.js'

export default function OrganisationUnitSetSelectorBarItem() {
    const [orgUnitOpen, setOrgUnitOpen] = useState(false)
    const { expanded, handleExpand, handleCollapse } = useExpandedState()
    const [dataSetId] = useDataSetId()
    const [, setOrgUnitId] = useOrgUnitId()
    const [, setCategoryOptionComboSelection] =
        useCategoryOptionComboSelection()

    const orgUnit = useOrgUnit()
    const userOrgUnits = useUserOrgUnits()
    const dataSetOrgUnitPaths = useDataSetOrgUnitPaths()

    const selectorBarItemValue = useSelectorBarItemValue()
    const selected = orgUnit.data ? [orgUnit.data.path] : []

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
                    roots={userOrgUnits.data || []}
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
                    filter={dataSetOrgUnitPaths.data || undefined}
                />
            </div>
        </SelectorBarItem>
    )
}
