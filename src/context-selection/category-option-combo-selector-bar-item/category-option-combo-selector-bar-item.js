import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import {
    useCategoryOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../use-context-selection.js'
import {
    useDeselectOnDataSetChange,
    useDeselectOnOrgUnitChange,
    useDeselectOnPeriodChange,
} from '../use-deselect/index.js'
import CategoriesMenu from './categories-menu.js'
import omit from './omit.js'
import useCategoryCombination from './use-category-combination.js'
import useSelected from './use-selected.js'
import useValueLabel from './use-value-label.js'

export default function CategoryOptionComboSelectorBarItem() {
    const [open, setOpen] = useState(false)
    const {
        loadingCategoryCombination,
        errorCategoryCombination,
        categoryCombination,
    } = useCategoryCombination()
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const [, setCategoryOptionComboSelection] =
        useCategoryOptionComboSelection()
    const [selected, setSelected] = useSelected()
    const valueLabel = useValueLabel()
    const deselectAll = () => {
        setSelected({})
        setCategoryOptionComboSelection([])
    }

    const onChange = ({ selected: value, categoryId }) => {
        if (!value) {
            const nextSelected = omit(categoryId, selected)
            setSelected(nextSelected)
            return
        }

        const nextSelected = { ...selected, [categoryId]: value }
        const nextCategoryOptionComboSelection = Object.entries(
            nextSelected
        ).map(([key, value]) => `${key}:${value}`)

        setSelected(nextSelected)
        setCategoryOptionComboSelection(nextCategoryOptionComboSelection)
    }

    useDeselectOnDataSetChange(deselectAll)
    useDeselectOnOrgUnitChange(deselectAll)
    useDeselectOnPeriodChange(deselectAll)

    if (
        !dataSetId ||
        !periodId ||
        !orgUnitId ||
        loadingCategoryCombination ||
        !categoryCombination?.categories.length ||
        categoryCombination?.isDefault
    ) {
        return null
    }

    const label = categoryCombination
        ? categoryCombination?.displayName
        : errorCategoryCombination
        ? i18n.t('Category option combination: An error occurred')
        : i18n.t('Loading categories...')

    return (
        <SelectorBarItem
            label={label}
            value={valueLabel}
            open={open}
            setOpen={setOpen}
            noValueMessage={i18n.t('Choose a data set')}
        >
            {errorCategoryCombination &&
                i18n.t('An error occurred loading the categories')}
            <CategoriesMenu
                close={() => setOpen(false)}
                selected={selected}
                onChange={onChange}
            />
        </SelectorBarItem>
    )
}
