import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { selectors, useMetadata } from '../../metadata/index.js'
import { useDataSetId } from '../use-context-selection/index.js'
import CategoriesMenu from './categories-menu.js'
import useOnDependentParamsChange from './use-on-dependent-params-change.js'
import useSelected from './use-selected.js'
import useSelectorBarItemLabel from './use-selector-bar-item-label.js'
import useSelectorBarItemValue from './use-selector-bar-item-value.js'
import useShouldComponentRenderNull from './use-should-component-render-null.js'

const hasCategoryNoOptions = (category) => category.categoryOptions.length === 0

const useSetSelectionHasNoFormMessage = (
    categories,
    setSelectionHasNoFormMessage
) => {
    useEffect(() => {
        if (categories.some(hasCategoryNoOptions)) {
            setSelectionHasNoFormMessage(
                i18n.t(
                    'At least one of the categories does not have any options due to the options not spanning over the entire selected period'
                )
            )
        } else {
            setSelectionHasNoFormMessage('')
        }
    }, [categories, setSelectionHasNoFormMessage])
}

const getCategoriesByIds = (categories, ids) => {
    const categoriesByIds = {}
    ids.forEach(id => (categoriesByIds[id] = categories[id]))
    return Object.values(categoriesByIds)
}

const resolveCategoryOptionIds = (categories, categoryOptions) => {
    return categories.map(category => ({
        ...category,
        categoryOptions: category.categoryOptions.map(
            id => categoryOptions[id]
        ),
    }))
}

export default function AttributeOptionComboSelectorBarItem({
    setSelectionHasNoFormMessage,
}) {
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const dataSets = selectors.getDataSets(metadata) || ''
    const dataSet = dataSets[dataSetId]
    const categoryComboId = dataSet?.categoryCombo.id
    const categoryCombos = selectors.getCategoryCombos(metadata)
    const categoryCombo = categoryCombos[categoryComboId]
    const categoryIds = categoryCombo?.categories || []
    const categories = selectors.getCategories(metadata)
    const relevantCategories = getCategoriesByIds(categories, categoryIds)
    const categoryOptions = selectors.getCategoryOptions(metadata)
    const relevantCategoriesWithOptions = resolveCategoryOptionIds(relevantCategories, categoryOptions)

    const [open, setOpen] = useState(false)
    const { deselectAll, select, selected } = useSelected()
    const shouldComponentRenderNull =
        useShouldComponentRenderNull(categoryCombo)
    const label = useSelectorBarItemLabel(categoryCombo)
    const valueLabel = useSelectorBarItemValue(categoryCombo)
    const onChange = ({ selected, categoryId }) =>
        select({
            value: selected,
            categoryId,
        })

    useOnDependentParamsChange(deselectAll)
    useSetSelectionHasNoFormMessage(
        relevantCategories,
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
