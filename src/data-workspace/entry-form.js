import { colors, IconFilter16, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import i18n from '../locales'
import { CategoryComboTable } from './category-combo-table.js'
import { MetadataContext } from './metadata-context.js'
import {
    getDataElementsByDataSetId,
    groupDataElementsByCatCombo,
} from './selectors.js'
import { DefaultForm } from './default-form'
import { FormSection, SectionForms } from './section'
import { CustomForm } from './custom-form'

const FORM_TYPES = {
    DEFAULT: DefaultForm,
    SECTION: SectionForms,
    CUSTOM: CustomForm,
}

export const EntryForm = ({ dataSet, getDataValue }) => {
    // Could potentially build table via props instead of rendering children
    const [globalFilter, setGlobalFilter] = React.useState('')
    const { metadata } = useContext(MetadataContext)

    if (!metadata) {
        return 'Loading metadata'
    }

    console.log('DATAZZZ', dataSet)
    if (!dataSet) {
        return null
    }

    const formType = dataSet.formType
    const Component = FORM_TYPES[formType]

    return (
        <div>
            <Component dataSet={dataSet} getDataValue={getDataValue} />
        </div>
    )
}

EntryForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        id: PropTypes.string,
    }),
}
