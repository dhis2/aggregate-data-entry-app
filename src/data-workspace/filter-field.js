import i18n from '@dhis2/d2-i18n'
import { Button, InputField } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useDebounceCallback } from '../shared/index.js'
import { FORM_TYPES } from './constants.js'
import styles from './entry-form.module.css'

export default function FilterField({ onFilterChange, formType }) {
    const [filterText, setFilterText] = useState('')
    const wrapperClasses = classNames(styles.filterWrapper, 'hide-for-print')

    useDebounceCallback(filterText, onFilterChange)

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
                value={filterText}
                onChange={({ value }) => setFilterText(value)}
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
    onFilterChange: PropTypes.func,
}
