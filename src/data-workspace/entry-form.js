import PropTypes from 'prop-types'
import React from 'react'
import { useFormState } from 'react-final-form'
import useRightHandPanelContext from '../right-hand-panel/use-right-hand-panel-context.js'
import { FORM_TYPES } from './constants.js'
import { CustomForm } from './custom-form/index.js'
import { DefaultForm } from './default-form.js'
import FilterField from './filter-field.js'
import { SectionForm } from './section-form/index.js'
import useCloseRightHandPanelOnSelectionChange from './use-close-right-hand-panel-on-selection-change.js'
const formTypeToComponent = {
    DEFAULT: DefaultForm,
    SECTION: SectionForm,
    CUSTOM: CustomForm,
}

export const EntryForm = React.memo(function EntryForm({ dataSet }) {
    const [globalFilterText, setGlobalFilterText] = React.useState('')
    const rightHandPanelContext = useRightHandPanelContext()
    const formType = dataSet.formType
    useFormState({
        onChange: (formState) => {
            // set formChanged when the form is dirty and the right hand panel is open
            // components in the right hand panel will reset the formChanged state to false
            if (formState.dirty && rightHandPanelContext.id) {
                rightHandPanelContext?.setFormChangedSincePanelOpened(true)
            }
        },
        subscription: {
            dirty: true,
        },
    })

    const Component = formTypeToComponent[formType]

    useCloseRightHandPanelOnSelectionChange()

    return (
        <>
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
