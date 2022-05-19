import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { useFormState } from 'react-final-form'
import { useRightHandPanelContext } from '../right-hand-panel/index.js'
import { FORM_TYPES } from './constants.js'
import { CustomForm } from './custom-form.js'
import { DefaultForm } from './default-form.js'
import FilterField from './filter-field.js'
import { SectionForm } from './section-form/index.js'

const formTypeToComponent = {
    DEFAULT: DefaultForm,
    SECTION: SectionForm,
    CUSTOM: CustomForm,
}

function useCloseSidebarOnFieldChange() {
    const rightHandPanel = useRightHandPanelContext()
    const subscribe = { active: true }
    const formState = useFormState({ subscribe })
    const prevActiveFieldRef = useRef(formState.active)

    useEffect(() => {
        const prevActiveField = prevActiveFieldRef.current
        const activeField = formState.active

        if (
            // Then panel is open
            // This also ensures that there was a previously focused field
            rightHandPanel.id &&
            // The user didn't focus another input
            !!activeField &&
            // The previously focused item and the currently focused item are
            // not the same
            prevActiveField !== activeField
        ) {
            rightHandPanel.hide()
        }

        if (prevActiveFieldRef.current !== activeField) {
            prevActiveFieldRef.current = activeField
        }
    }, [prevActiveFieldRef, formState.active, rightHandPanel])
}

export const EntryForm = ({ dataSet }) => {
    const [globalFilterText, setGlobalFilterText] = React.useState('')
    const formType = dataSet.formType
    const Component = formTypeToComponent[formType]

    useCloseSidebarOnFieldChange()

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
}

EntryForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        formType: PropTypes.string,
        id: PropTypes.string,
    }),
}
