import i18n from '@dhis2/d2-i18n'
import { Button, InputField } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useHighlightedFieldStore } from '../shared/index.js'
import { FORM_TYPES } from './constants.js'
import styles from './entry-form.module.css'

export default function FilterField({ value, setFilterText, formType }) {
    const setHighlightedFieldId = useHighlightedFieldStore(
        (state) => state.setHighlightedField
    )
    const wrapperClasses = classNames(styles.filterWrapper, 'hide-for-print')
    return (
        <div className={wrapperClasses}>
            <InputField
                name="filter-input"
                className={styles.filterField}
                type="text"
                placeholder={
                    formType === FORM_TYPES.SECTION
                        ? i18n.t('Filter fields in all sections')
                        : i18n.t('Filter fields')
                }
                value={value}
                onChange={({ value }) => setFilterText(value)}
                onFocus={() => setHighlightedFieldId(null)}
            />
            <Button
                secondary
                small
                name="Clear"
                onClick={() => setFilterText('')}
            >
                {i18n.t('Clear filter')}
            </Button>
        </div>
    )
}

FilterField.propTypes = {
    formType: PropTypes.string,
    setFilterText: PropTypes.func,
    value: PropTypes.string,
}
