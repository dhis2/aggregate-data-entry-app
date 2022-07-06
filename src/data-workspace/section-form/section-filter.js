import i18n from '@dhis2/d2-i18n'
import { colors, IconFilter16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useDebounceCallback } from '../../shared/index.js'
import styles from './section.module.css'

export const SectionFilter = ({ id, onFilterChange }) => {
    const [filterText, setFilterText] = useState('')

    useDebounceCallback(filterText, onFilterChange)

    return (
        <label htmlFor={id} className={styles.filterWrapper}>
            <IconFilter16 color={colors.grey600} />
            <input
                name={id}
                id={id}
                type="text"
                placeholder={i18n.t('Type here to filter in this section')}
                value={filterText}
                onChange={({ target }) => setFilterText(target.value)}
                className={styles.filterInput}
            />
        </label>
    )
}

SectionFilter.propTypes = {
    id: PropTypes.string,
    onFilterChange: PropTypes.func,
}
