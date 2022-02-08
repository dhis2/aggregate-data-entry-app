import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import CategoriesMenu from './categories-menu.js'
import useCategoryCombination from './use-category-combination.js'
import useOnDependentParamsChange from './use-on-dependent-params-change.js'
import useSelected from './use-selected.js'
import useSelectorBarItemLabel from './use-selector-bar-item-label.js'
import useSelectorBarItemValue from './use-selector-bar-item-value.js'
import useShouldComponentRenderNull from './use-should-component-render-null.js'

const hasCategoryNoOptions = category => category.categoryOptions.length === 0

const useSetSelectionHasNoFormMessage = (categoryCombo, setSelectionHasNoFormMessage) => {
    useEffect(() => {
        if (categoryCombo?.categories.some(hasCategoryNoOptions)) {
            setSelectionHasNoFormMessage(
                i18n.t(
                    'At least of the the categories does not have any options due to the options not spanning over the entire selected period'
                )
            )
        } else {
            setSelectionHasNoFormMessage('')
        }
    }, [categoryCombo, setSelectionHasNoFormMessage])
}

export default function AttributeOptionComboSelectorBarItem({
    setSelectionHasNoFormMessage,
}) {
    const [open, setOpen] = useState(false)
    const categoryCombination = useCategoryCombination()
    const { deselectAll, select, selected } = useSelected()
    const shouldComponentRenderNull = useShouldComponentRenderNull(categoryCombination)
    const label = useSelectorBarItemLabel(categoryCombination)
    const valueLabel = useSelectorBarItemValue(categoryCombination)
    const onChange = ({ selected, categoryId }) =>
        select({
            value: selected,
            categoryId,
        })

    useOnDependentParamsChange(deselectAll)
    useSetSelectionHasNoFormMessage(
        categoryCombination.data,
        setSelectionHasNoFormMessage
    )

    if (shouldComponentRenderNull) {
        return null
    }

    const renderMenu =
        categoryCombination.called &&
        !categoryCombination.loading &&
        !categoryCombination.error &&
        categoryCombination.data

    return (
        <div data-test="attribute-option-combo-selector">
            <SelectorBarItem
                disabled={categoryCombination.data?.isDefault}
                label={label}
                value={valueLabel}
                open={open}
                setOpen={setOpen}
                noValueMessage={i18n.t('Choose a data set')}
            >
                {categoryCombination.error &&
                    i18n.t('An error occurred loading the categories')}

                {renderMenu && (
                    <CategoriesMenu
                        categoryCombination={categoryCombination}
                        close={() => setOpen(false)}
                        selected={selected}
                        onChange={onChange}
                    />
                )}
            </SelectorBarItem>
        </div>
    )
}

AttributeOptionComboSelectorBarItem.propTypes = {
    setSelectionHasNoFormMessage: PropTypes.func.isRequired,
}
