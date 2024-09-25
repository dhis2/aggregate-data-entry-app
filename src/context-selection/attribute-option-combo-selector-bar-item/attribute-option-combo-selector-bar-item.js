import { useAlert, useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    selectors,
    useDataSetId,
    useMetadata,
    useOrgUnitId,
    usePeriodId,
    useAttributeOptionComboSelection,
} from '../../shared/index.js'
import CategoriesMenu from './categories-menu.js'
import useSelected from './use-selected.js'
import useSelectorBarItemLabel from './use-selector-bar-item-label.js'
import useSelectorBarItemValue from './use-selector-bar-item-value.js'
import useShouldComponentRenderNull from './use-should-component-render-null.js'

const hasCategoryNoOptions = (category) => category.categoryOptions.length === 0

const useSetSelectionHasNoFormMessage = (
    categoriesWithNoOptions,
    setSelectionHasNoFormMessage
) => {
    useEffect(() => {
        if (categoriesWithNoOptions?.length > 0) {
            setSelectionHasNoFormMessage(
                i18n.t(
                    'Some categories have no valid options for the selected period or organisation unit ({{categories}})',
                    {
                        categories: categoriesWithNoOptions
                            .map((cat) => cat.displayName)
                            .join(', '),
                    }
                )
            )
        } else {
            setSelectionHasNoFormMessage('')
        }
    }, [categoriesWithNoOptions, setSelectionHasNoFormMessage])

    return categoriesWithNoOptions
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
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    const relevantCategoriesWithOptions =
        selectors.getCategoriesWithOptionsWithinPeriodWithOrgUnit(
            metadata,
            dataSetId,
            periodId,
            orgUnitId,
            calendar
        )

    const [open, setOpen] = useState(false)
    const { select, selected } = useSelected()

    const { show: showWarningAlert } = useAlert((message) => message, {
        warning: true,
    })

    useEffect(() => {
        const resetAttributeOptionComboSelection = (id) => {
            setAttributeOptionComboSelection(undefined)
            showWarningAlert(
                i18n.t(
                    'There was a problem loading the {{objectType}} selection ({{id}}). You might not have access, or the selection might be invalid.',
                    {
                        objectType: 'Attribute Option Combo',
                        id,
                    }
                )
            )
        }

        const relevantCategories = relevantCategoriesWithOptions.map(
            ({ id }) => id
        )

        for (const categoryId of Object.keys(attributeOptionComboSelection)) {
            const relevantCategoryOptions = relevantCategoriesWithOptions
                .filter(({ id }) => id === categoryId)[0]
                ?.categoryOptions.map(({ id }) => id)
            if (!relevantCategories.includes(categoryId)) {
                resetAttributeOptionComboSelection(categoryId)
                return
            }
            if (
                !relevantCategoryOptions.includes(
                    attributeOptionComboSelection[categoryId]
                )
            ) {
                resetAttributeOptionComboSelection(
                    attributeOptionComboSelection[categoryId]
                )
                return
            }
        }
    }, [
        attributeOptionComboSelection,
        relevantCategoriesWithOptions,
        metadata,
        setAttributeOptionComboSelection,
        showWarningAlert,
    ])

    const label = useSelectorBarItemLabel(categoryCombo)
    const valueLabel = useSelectorBarItemValue(categoryCombo)
    const onChange = ({ selected, categoryId }) =>
        select({
            value: selected,
            categoryId,
        })

    const categoriesWithNoOptions =
        relevantCategoriesWithOptions.filter(hasCategoryNoOptions)
    const shouldComponentRenderNull =
        useShouldComponentRenderNull(categoryCombo)

    useSetSelectionHasNoFormMessage(
        categoriesWithNoOptions,
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
