import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import {
    selectors,
    useMetadata,
    useDataSetId,
    useNoFormOrLockedContext,
    useOrgUnitId,
    usePeriodId,
} from '../../shared/index.js'
import { noFormOrLockedStates } from '../../shared/no-form-or-locked/no-form-and-locked-states.js'
import CategoriesMenu from './categories-menu.js'
import useSelected from './use-selected.js'
import useSelectorBarItemLabel from './use-selector-bar-item-label.js'
import useSelectorBarItemValue from './use-selector-bar-item-value.js'
import useShouldComponentRenderNull from './use-should-component-render-null.js'

const hasCategoryNoOptions = (category) => category.categoryOptions.length === 0

export default function AttributeOptionComboSelectorBarItem() {
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const [orgUnitId] = useOrgUnitId()
    const [periodId] = usePeriodId()
    const categoryCombo = selectors.getCategoryComboByDataSetId(
        metadata,
        dataSetId
    )
    const relevantCategoriesWithOptions =
        selectors.getCategoriesWithOptionsWithinPeriodWithOrgUnit(
            metadata,
            dataSetId,
            periodId,
            orgUnitId
        )

    const [open, setOpen] = useState(false)
    const { select, selected } = useSelected()
    const label = useSelectorBarItemLabel(categoryCombo)
    const valueLabel = useSelectorBarItemValue(categoryCombo)
    const onChange = ({ selected, categoryId }) =>
        select({
            value: selected,
            categoryId,
        })

    const categoriesWithNoOptions =
        relevantCategoriesWithOptions.filter(hasCategoryNoOptions)

    const { setNoFormOrLockedStatus } = useNoFormOrLockedContext()

    useEffect(() => {
        if (categoriesWithNoOptions.length > 0) {
            setNoFormOrLockedStatus(noFormOrLockedStates.INVALID_OPTIONS)
        }
    }, [categoriesWithNoOptions, setNoFormOrLockedStatus])

    const shouldComponentRenderNull =
        useShouldComponentRenderNull(categoryCombo)

    if (shouldComponentRenderNull) {
        return null
    }

    return (
        <div data-test="attribute-option-combo-selector">
            <SelectorBarItem
                label={label}
                value={valueLabel}
                open={open}
                setOpen={setOpen}
                noValueMessage={i18n.t('Choose a data set')}
            >
                <CategoriesMenu
                    categories={relevantCategoriesWithOptions}
                    close={() => setOpen(false)}
                    selected={selected}
                    onChange={onChange}
                />
            </SelectorBarItem>
        </div>
    )
}
