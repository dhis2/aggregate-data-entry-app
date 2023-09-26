import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useFormState } from 'react-final-form'
import {
    LockedStates,
    useLockedContext,
    useEntryFormStore,
} from '../shared/index.js'
import { FORM_TYPES } from './constants.js'
import { CustomForm } from './custom-form/index.js'
import { DefaultForm } from './default-form.js'
import FilterField from './filter-field.js'
import { SectionForm } from './section-form/index.js'

const lockedNoticeBoxMessages = {
    [LockedStates.LOCKED_DATA_INPUT_PERIOD]: i18n.t(
        'Data cannot be added or changed outside of the data input period.'
    ),
    [LockedStates.LOCKED_ORGANISATION_UNIT]: i18n.t(
        'Data cannot be added or changed because organisation unit is closed for the selected period.'
    ),
    [LockedStates.LOCKED_EXPIRY_DAYS]: i18n.t(
        'Data cannot be added or changed because data entry has concluded.'
    ),
    [LockedStates.LOCKED_APPROVED]: i18n.t(
        'Data cannot be added or changed because data has been approved.'
    ),
    [LockedStates.LOCKED_NO_AUTHORITY]: i18n.t(
        'You do not have the authority to edit entry forms'
    ),
}

const formTypeToComponent = {
    DEFAULT: DefaultForm,
    SECTION: SectionForm,
    CUSTOM: CustomForm,
}

export const EntryForm = React.memo(function EntryForm({ dataSet }) {
    const [globalFilterText, setGlobalFilterText] = React.useState('')
    const {
        locked,
        lockStatus: { state: lockState },
    } = useLockedContext()
    const formType = dataSet.formType

    const Component = formTypeToComponent[formType]

    return (
        <>
            {locked && (
                <NoticeBox title={i18n.t('Data set locked')}>
                    {lockedNoticeBoxMessages[lockState]}
                </NoticeBox>
            )}
            {formType !== FORM_TYPES.CUSTOM && (
                <FilterField
                    value={globalFilterText}
                    setFilterText={setGlobalFilterText}
                    formType={formType}
                />
            )}
            <EntryFormErrorSpy />
            <Component dataSet={dataSet} globalFilterText={globalFilterText} />
        </>
    )
})

/*  Used to sync store with errors from form
    In its own component to prevent unecessarily re-renders in the tree */
const EntryFormErrorSpy = () => {
    const setFormErrors = useEntryFormStore((state) => state.setErrors)

    useFormState({
        onChange: (formState) => {
            setFormErrors(formState.errors)
        },
        subscription: {
            errors: true,
        },
    })
    return null
}

EntryForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        formType: PropTypes.string,
        id: PropTypes.string,
    }),
}
