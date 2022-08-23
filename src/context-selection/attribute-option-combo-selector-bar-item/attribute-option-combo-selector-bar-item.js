import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    selectors,
    useMetadata,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../../shared/index.js'
import CategoriesMenu from './categories-menu.js'
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
        if (categoryWithNoOptionsExists?.length > 0) {
            setSelectionHasNoFormMessage(
                i18n.t(
                    'The following categories do not have valid options for the selected period or organisation unit: {{categories}}',
                    {
                        categories: categoryWithNoOptionsExists
                            .map((category) => category?.displayName)
                            .join(', '),
                    }
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
    const [orgUnitId] = useOrgUnitId()
    const [periodId] = usePeriodId()
    const categoryCombo = selectors.getCategoryComboByDataSetId(
        metadata,
        dataSetId
    )
    const relevantCategoriesWithOptions =
        selectors.getCategoriesWithOptionsWithinPeriodForOrgUnit(
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

    const categoryWithNoOptionsExists =
        relevantCategoriesWithOptions.filter(hasCategoryNoOptions)
    const shouldComponentRenderNull =
        useShouldComponentRenderNull(categoryCombo)

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
