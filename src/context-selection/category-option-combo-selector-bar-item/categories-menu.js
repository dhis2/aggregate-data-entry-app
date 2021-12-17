import i18n from '@dhis2/d2-i18n'
import { Button, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import css from './categories-menu.module.css'
import useCategoryCombination from './use-category-combination.js'

export default function CategoriesMenu({ close, selected, onChange }) {
    const {
        calledCategoryCombination,
        loadingCategoryCombination,
        errorCategoryCombination,
        categoryCombination,
    } = useCategoryCombination()

    if (!calledCategoryCombination || loadingCategoryCombination) {
        return i18n.t('Loading categories...')
    }

    if (errorCategoryCombination) {
        return i18n.t('An error occurred loading the categories')
    }

    return (
        <div className={css.container}>
            <div className={css.inputs}>
                {categoryCombination?.categories.map(
                    ({ id, displayName, categoryOptions }) => (
                        <div className={css.input} key={id}>
                            <SingleSelectField
                                label={displayName}
                                selected={selected[id]}
                                onChange={({ selected }) =>
                                    onChange({
                                        categoryId: id,
                                        selected,
                                    })
                                }
                            >
                                {categoryOptions.map(({ id, displayName }) => (
                                    <SingleSelectOption
                                        key={id}
                                        value={id}
                                        label={displayName}
                                    />
                                ))}
                            </SingleSelectField>
                        </div>
                    )
                )}
            </div>

            <Button
                primary
                onClick={(_, evt) => {
                    // required as otherwise it'd trigger a `setOpen(true)` call as
                    // react thinks of this dropdown as being inside of the
                    // selector. A click on the selector opens the menu.
                    evt.stopPropagation()

                    close()
                }}
            >
                {i18n.t('Close')}
            </Button>
        </div>
    )
}

CategoriesMenu.propTypes = {
    close: PropTypes.func.isRequired,
    // No specific shape due to dynamic keys,
    // only `{ [categoryId]: categoryOptionId }`
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}
