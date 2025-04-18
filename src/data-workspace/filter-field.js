import i18n from '@dhis2/d2-i18n'
import { Button, InputField } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { FORM_TYPES } from './constants.js'
import styles from './entry-form.module.css'

export default function FilterField({ value, setFilterText, formType }) {
    const wrapperClasses = classNames(styles.filterWrapper, styles.hideForPrint)
    return (
        <div className={wrapperClasses}>
            <InputField
                name="filter-input"
                className={styles.filterField}
                type="text"
                dense
                placeholder={
                    formType === FORM_TYPES.SECTION
                        ? i18n.t('Filter data elements in all sections')
                        : i18n.t('Filter fields')
                }
                value={value}
                onChange={({ value }) => setFilterText(value)}
            />
            {value && (
                <Button
                    secondary
                    small
                    name="Clear"
                    onClick={() => setFilterText('')}
                >
                    {i18n.t('Clear filter')}
                </Button>
            )}
        </div>
    )
}

FilterField.propTypes = {
    formType: PropTypes.string,
    setFilterText: PropTypes.func,
    value: PropTypes.string,
}
