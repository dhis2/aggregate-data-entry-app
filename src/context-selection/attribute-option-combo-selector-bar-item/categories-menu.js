import i18n from '@dhis2/d2-i18n'
import { Button, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import css from './categories-menu.module.css'

export default function CategoriesMenu({
    categoryCombination,
    close,
    selected,
    onChange,
}) {
    if (!categoryCombination.called || categoryCombination.loading) {
        return i18n.t('Loading categories...')
    }

    if (categoryCombination.error) {
        return i18n.t('An error occurred loading the categories')
    }

    return (
        <div className={css.container}>
            <div className={css.inputs}>
                {categoryCombination.data?.categories.map(
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
                secondary
                onClick={(_, evt) => {
                    // required as otherwise it'd trigger a `setOpen(true)` call as
                    // react thinks of this dropdown as being inside of the
                    // selector. A click on the selector opens the menu.
                    evt.stopPropagation()

                    close()
                }}
            >
                {i18n.t('Hide menu')}
            </Button>
        </div>
    )
}

CategoriesMenu.propTypes = {
    categoryCombination: PropTypes.shape({
        called: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        data: PropTypes.object,
        error: PropTypes.instanceOf(Error),
    }).isRequired,
    close: PropTypes.func.isRequired,
    selected: PropTypes.objectOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
}