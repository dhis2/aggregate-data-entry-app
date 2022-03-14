import PropTypes from 'prop-types'
import React from 'react'
import {
    BasicInput,
    BooleanRadios,
    FileResourceInput,
    LongText,
    OptionSet,
    TrueOnlyCheckbox,
} from '../inputs/index.js'
import { useDataValueParams } from './use-data-value-params.js'
import { VALUE_TYPES } from './value-types.js'

export function EntryFieldInput({ fieldname, dataElement: de, setSyncStatus }) {
    const [deId, cocId] = fieldname.split('.')
    const dataValueParams = useDataValueParams({ deId, cocId })

    const sharedProps = { fieldname, dataValueParams, setSyncStatus }

    // If this is an option set, return OptionSet component
    if (de.optionSetValue) {
        return <OptionSet {...sharedProps} optionSetId={de.optionSet.id} />
    }
    // Otherwise, check for the valueType
    switch (de.valueType) {
        case VALUE_TYPES.BOOLEAN: {
            return <BooleanRadios {...sharedProps} />
        }
        case VALUE_TYPES.FILE_RESOURCE: {
            return <FileResourceInput {...sharedProps} />
        }
        case VALUE_TYPES.IMAGE: {
            return <FileResourceInput {...sharedProps} image />
        }
        case VALUE_TYPES.LONG_TEXT: {
            return <LongText {...sharedProps} />
        }
        case VALUE_TYPES.TRUE_ONLY: {
            return <TrueOnlyCheckbox {...sharedProps} />
        }
        default: {
            return <BasicInput {...sharedProps} valueType={de.valueType} />
        }
    }
}
EntryFieldInput.propTypes = {
    dataElement: PropTypes.shape({
        id: PropTypes.string,
        optionSet: PropTypes.shape({
            id: PropTypes.string,
        }),
        optionSetValue: PropTypes.bool,
        valueType: PropTypes.string,
    }),
    fieldname: PropTypes.string,
    setSyncStatus: PropTypes.func,
}
