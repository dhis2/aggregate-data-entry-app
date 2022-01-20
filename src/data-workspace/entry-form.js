import i18n from '@dhis2/d2-i18n'
import { Button, InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { CustomForm } from './custom-form.js'
import { DefaultForm } from './default-form.js'
import styles from './entry-form.module.css'
import { SectionForms } from './section.js'

const FORM_TYPES = {
    DEFAULT: 'DEFAULT',
    SECTION: 'SECTION',
    CUSTOM: 'CUSTOM',
}

const formTypeToComponent = {
    DEFAULT: DefaultForm,
    SECTION: SectionForms,
    CUSTOM: CustomForm,
}

export const EntryForm = ({ dataSet }) => {
    const [globalFilterText, setGlobalFilterText] = React.useState('')

    if (!dataSet) {
        return null
    }

    const formType = dataSet.formType
    const Component = formTypeToComponent[formType]

    return (
        <div>
            {formType !== FORM_TYPES.CUSTOM && (
                <FilterField
                    value={globalFilterText}
                    setFilterText={setGlobalFilterText}
                    formType={formType}
                />
            )}
            <Component dataSet={dataSet} globalFilterText={globalFilterText} />
        </div>
    )
}

EntryForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        formType: PropTypes.string,
        id: PropTypes.string,
    }),
}

const FilterField = ({ value, setFilterText, formType }) => (
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
        <Button secondary small name="Clear" onClick={() => setFilterText('')}>
            {i18n.t('Clear filter')}
        </Button>
    </div>
)

FilterField.propTypes = {
    formType: PropTypes.string,
    setFilterText: PropTypes.func,
    value: PropTypes.string,
}
