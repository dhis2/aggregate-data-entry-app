import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import CategoriesMenu from './categories-menu.js'
import useCategoryCombination from './use-category-combination.js'
import useOnDependentParamsChange from './use-on-dependent-params-change.js'
import useSelected from './use-selected.js'
import useSelectorBarItemLabel from './use-selector-bar-item-label.js'
import useSelectorBarItemValue from './use-selector-bar-item-value.js'
import useShouldComponentRenderNull from './use-should-component-render-null.js'

export default function CategoryOptionComboSelectorBarItem() {
    const [open, setOpen] = useState(false)
    const categoryCombination = useCategoryCombination()
    const { deselectAll, select, selected } = useSelected()
    const shouldComponentRenderNull = useShouldComponentRenderNull()
    const label = useSelectorBarItemLabel()
    const valueLabel = useSelectorBarItemValue()
    const onChange = ({ selected, categoryId }) =>
        select({
            value: selected,
            categoryId,
        })

    useOnDependentParamsChange(deselectAll)

    if (shouldComponentRenderNull) {
        return null
    }

    return (
        <SelectorBarItem
            label={label}
            value={valueLabel}
            open={open}
            setOpen={setOpen}
            noValueMessage={i18n.t('Choose a data set')}
        >
            {categoryCombination.error &&
                i18n.t('An error occurred loading the categories')}

            <CategoriesMenu
                close={() => setOpen(false)}
                selected={selected}
                onChange={onChange}
            />
        </SelectorBarItem>
    )
}
