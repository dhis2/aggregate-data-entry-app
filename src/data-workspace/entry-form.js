import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useFormState } from 'react-final-form'
import { useRightHandPanelContext } from '../right-hand-panel/index.js'
import {
    LockedStates,
    useFormChangedSincePanelOpenedContext,
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
    [LockedStates.LOCKED_EXPIRY_DAYS]: i18n.t(
        'Data cannot be added or changed because data entry has concluded.'
    ),
    [LockedStates.LOCKED_APPROVED]: i18n.t(
        'Data cannot be added or changed because data has been approved.'
    ),
}

const formTypeToComponent = {
    DEFAULT: DefaultForm,
    SECTION: SectionForm,
    CUSTOM: CustomForm,
}

export const EntryForm = React.memo(function EntryForm({ dataSet }) {
    const [globalFilterText, setGlobalFilterText] = React.useState('')
    const { setFormChangedSincePanelOpened } =
        useFormChangedSincePanelOpenedContext()
    const rightHandPanelContext = useRightHandPanelContext()
    const { locked, lockStatus } = useLockedContext()
    const formType = dataSet.formType
    const setFormErrors = useEntryFormStore((state) => state.setErrors)

    useFormState({
        onChange: (formState) => {
            setFormErrors(formState.errors)
            // set formChanged when the form is dirty and the right hand panel is open
            // components in the right hand panel will reset the formChanged state to false
            if (formState.dirty && rightHandPanelContext.id) {
                setFormChangedSincePanelOpened(true)
            }
        },
        subscription: {
            dirty: true,
            errors: true,
        },
    })

    const Component = formTypeToComponent[formType]

    return (
        <>
            {locked && (
                <NoticeBox title={i18n.t('Data set locked')}>
                    {lockedNoticeBoxMessages[lockStatus]}
                </NoticeBox>
            )}
            {formType !== FORM_TYPES.CUSTOM && (
                <FilterField
                    value={globalFilterText}
                    setFilterText={setGlobalFilterText}
                    formType={formType}
                />
            )}

            <Component dataSet={dataSet} globalFilterText={globalFilterText} />
        </>
    )
})

EntryForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        formType: PropTypes.string,
        id: PropTypes.string,
    }),
}
