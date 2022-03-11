import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useContextSelection } from '../../context-selection/index.js'
import { useMetadata } from '../../metadata/index.js'
import {
    getCategoryComboById,
    getDataSetById,
} from '../../metadata/selectors.js'
import { OptionSet, FileResourceInput } from '../inputs/index.js'
import { useDataValueMutation } from './use-data-value-mutation.js'
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
    const [lastSyncedValue, setLastSyncedValue] = useState()
    const dataValueParams = useDataValueParams({ deId, cocId })

    // todo: move into lower level components
    const { mutate } = useDataValueMutation()
    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { ...dataValueParams, value: value || '' },
            { onSuccess: () => setLastSyncedValue(value) }
        )
    }

    // todo: rename name to fieldname
    // ? Give all these dataValueParams?
    // ? Give all these syncStatus?
    if (de.optionSetValue) {
        return (
            <OptionSet
                name={fieldname}
                optionSetId={de.optionSet.id}
                lastSyncedValue={lastSyncedValue}
                syncData={syncData}
            />
        )
    } else if (de.valueType === 'FILE_RESOURCE' || de.valueType === 'IMAGE') {
        return (
            <FileResourceInput
                name={fieldname}
                dataValueParams={dataValueParams}
                setSyncStatus={setSyncStatus}
                image={de.valueType === 'IMAGE'}
            />
        )
    } else {
        // todo: inputComponentByValueType
        const Input = VALUE_TYPES[de.valueType].Input
        return (
            <Input
                name={fieldname}
                syncData={syncData}
                lastSyncedValue={lastSyncedValue}
            />
        )
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
