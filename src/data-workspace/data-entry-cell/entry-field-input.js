import PropTypes from 'prop-types'
import React from 'react'
import { useContextSelection } from '../../context-selection/index.js'
import { useMetadata } from '../../metadata/index.js'
import {
    getCategoryComboById,
    getDataSetById,
} from '../../metadata/selectors.js'
import {
    BasicInput,
    BooleanRadios,
    FileResourceInput,
    LongText,
    OptionSet,
    TrueOnlyCheckbox,
} from '../inputs/index.js'
import { VALUE_TYPES } from './value-types.js'

const useDataValueParams = ({ deId, cocId }) => {
    const [dataEntryContext] = useContextSelection()
    const metadataFetch = useMetadata()

    if (metadataFetch.isLoading || metadataFetch.isError) {
        return null
    }

    const { dataSetId, orgUnitId, periodId, attributeOptionComboSelection } =
        dataEntryContext

    const attributeComboId = getDataSetById(metadataFetch.data, dataSetId)
        .categoryCombo.id
    const isDefaultAttributeCombo = getCategoryComboById(
        metadataFetch.data,
        attributeComboId
    ).isDefault

    const dvParams = {
        de: deId,
        co: cocId,
        ds: dataSetId,
        ou: orgUnitId,
        pe: periodId,
    }
    // Add attribute params to mutation if relevant
    if (!isDefaultAttributeCombo) {
        // Get a ';'-separated listed of attribute options
        const attributeOptionIdList = Object.values(
            attributeOptionComboSelection
        ).join(';')
        dvParams.cc = attributeComboId
        dvParams.cp = attributeOptionIdList
    }

    return dvParams
}

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
