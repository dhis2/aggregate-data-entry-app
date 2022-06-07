import PropTypes from 'prop-types'
import React from 'react'
import { FORM_TYPES } from './constants.js'
import { CustomForm } from './custom-form.js'
import { DefaultForm } from './default-form.js'
import FilterField from './filter-field.js'
import { SectionForm } from './section-form/index.js'
import useCloseRightHandPanelOnSelectionChange from './use-close-right-hand-panel-on-selection-change.js'
import useCloseSidebarOnFieldChange from './use-close-sidebar-on-field-change.js'

const formTypeToComponent = {
    DEFAULT: DefaultForm,
    SECTION: SectionForm,
    CUSTOM: CustomForm,
}

export const EntryForm = ({ dataSet }) => {
    const [globalFilterText, setGlobalFilterText] = React.useState('')
    const formType = dataSet.formType
    const Component = formTypeToComponent[formType]

    useCloseSidebarOnFieldChange()
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
}

EntryForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        formType: PropTypes.string,
        id: PropTypes.string,
    }),
}
