import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useContextSelection } from '../../context-selection/index.js'
import { useMetadata } from '../../metadata/index.js'
import {
    getCategoryComboById,
    getDataSetById,
} from '../../metadata/selectors.js'
import { useDataValueMutation } from './use-data-value-mutation.js'
import { getInputByDataElement } from './value-types.js'

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

export function EntryFieldInput({
    fieldname,
    dataElement: de,
    setSyncStatus,
}) {
    const [deId, cocId] = fieldname.split('.')
    const [lastSyncedValue, setLastSyncedValue] = useState()
    const dataValueParams = useDataValueParams({ deId, cocId })

    const { mutate } = useDataValueMutation()

    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { ...dataValueParams, value: value || '' },
            { onSuccess: () => setLastSyncedValue(value) }
        )
    }

    const Input = getInputByDataElement(de)

    return (
        <Input
            name={fieldname}
            // disabled={true} (todo)
            // props for most inputs:
            syncData={syncData}
            dataElement={de}
            lastSyncedValue={lastSyncedValue}
            // props for file inputs, which use different mutations:
            dataValueParams={dataValueParams}
            setSyncStatus={setSyncStatus}
        />
    )
}
EntryFieldInput.propTypes = {
    dataElement: PropTypes.shape({
        id: PropTypes.string,
    }),
    fieldname: PropTypes.string,
    setSyncStatus: PropTypes.func,
}
