import i18n from '@dhis2/d2-i18n'
import { Button, InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { useForm } from 'react-final-form'
import { useSidebar } from '../sidebar/index.js'
import { CustomForm } from './custom-form.js'
import { DefaultForm } from './default-form.js'
import styles from './entry-form.module.css'
import { SectionForm } from './section-form/index.js'

const FORM_TYPES = {
    DEFAULT: 'DEFAULT',
    SECTION: 'SECTION',
    CUSTOM: 'CUSTOM',
}

const formTypeToComponent = {
    DEFAULT: DefaultForm,
    SECTION: SectionForm,
    CUSTOM: CustomForm,
}

export const EntryForm = ({ dataSet }) => {
    const [globalFilterText, setGlobalFilterText] = React.useState('')
    const form = useForm()
    const sidebar = useSidebar()
    const prevActiveFieldRef = useRef(form.getState().active)

    if (!dataSet) {
        return null
    }

    const formType = dataSet.formType
    const Component = formTypeToComponent[formType]

    const closeSidebarOnFieldChange = () => {
        const prevActiveField = prevActiveFieldRef.current
        const activeField = form.getState().active

        if (sidebar.visible && prevActiveField !== activeField) {
            sidebar.close()
            prevActiveFieldRef.current = activeField
        }
    }

    return (
        <>
            {formType !== FORM_TYPES.CUSTOM && (
                <FilterField
                    value={globalFilterText}
                    setFilterText={setGlobalFilterText}
                    formType={formType}
                />
            )}
            <Component
                dataSet={dataSet}
                globalFilterText={globalFilterText}
                onFocus={closeSidebarOnFieldChange}
            />
        </>
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
