import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { selectors, useMetadata } from '../../metadata/index.js'
import { useDataSetId } from '../use-context-selection/index.js'
import CategoriesMenu from './categories-menu.js'
import useCategoriesWithOptionsWithinPeriod from './use-categories-with-options-within-period.js'
import useOnDependentParamsChange from './use-on-dependent-params-change.js'
import useSelected from './use-selected.js'
import useSelectorBarItemLabel from './use-selector-bar-item-label.js'
import useSelectorBarItemValue from './use-selector-bar-item-value.js'
import useShouldComponentRenderNull from './use-should-component-render-null.js'

const hasCategoryNoOptions = (category) => category.categoryOptions.length === 0

const useSetSelectionHasNoFormMessage = (
    categoryWithNoOptionsExists,
    setSelectionHasNoFormMessage
) => {
    useEffect(() => {
        if (categoryWithNoOptionsExists) {
            setSelectionHasNoFormMessage(
                i18n.t(
                    'At least one of the categories does not have any options due to the options not spanning over the entire selected period'
                )
            )
        } else {
            setSelectionHasNoFormMessage('')
        }
    }, [categoryWithNoOptionsExists, setSelectionHasNoFormMessage])

    return categoryWithNoOptionsExists
}

export default function AttributeOptionComboSelectorBarItem({
    setSelectionHasNoFormMessage,
}) {
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const categoryCombo = selectors.getCategoryComboByDataSetId(
        metadata,
        dataSetId
    )
    const relevantCategoriesWithOptions = useCategoriesWithOptionsWithinPeriod()

    const [open, setOpen] = useState(false)
    const { deselectAll, select, selected } = useSelected(
        relevantCategoriesWithOptions
    )
    const label = useSelectorBarItemLabel(categoryCombo)
    const valueLabel = useSelectorBarItemValue(categoryCombo)
    const onChange = ({ selected, categoryId }) =>
        select({
            value: selected,
            categoryId,
        })

    const categoryWithNoOptionsExists =
        relevantCategoriesWithOptions.some(hasCategoryNoOptions)
    const shouldComponentRenderNull = useShouldComponentRenderNull(
        categoryCombo,
        categoryWithNoOptionsExists
    )

    useOnDependentParamsChange(deselectAll)
    useSetSelectionHasNoFormMessage(
        categoryWithNoOptionsExists,
        setSelectionHasNoFormMessage
    )

    if (shouldComponentRenderNull) {
        return null
    }

    return (
        <div data-test="attribute-option-combo-selector">
            <SelectorBarItem
                disabled={categoryCombo.isDefault}
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

AttributeOptionComboSelectorBarItem.propTypes = {
    setSelectionHasNoFormMessage: PropTypes.func.isRequired,
}
