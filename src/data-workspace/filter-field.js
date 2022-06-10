import i18n from '@dhis2/d2-i18n'
import { Button, InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { FORM_TYPES } from './constants.js'
import styles from './entry-form.module.css'

export default function FilterField({ value, setFilterText, formType }) {
    return (
        <div className={styles.filterWrapper}>
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
