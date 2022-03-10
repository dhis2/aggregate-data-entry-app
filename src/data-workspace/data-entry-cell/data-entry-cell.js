import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useContextSelection } from '../../context-selection/index.js'
import { useMetadata } from '../../metadata/index.js'
import {
    getCategoryComboById,
    getDataSetById,
} from '../../metadata/selectors.js'
import styles from './data-entry-cell.module.css'
import { InnerWrapper } from './inner-wrapper.js'
import { useDataValueMutation } from './use-data-value-mutation.js'
import { ValidationTooltip } from './validation-tooltip.js'
import { getInputByDataElement, VALUE_TYPES } from './value-types.js'

export const DataEntryCell = React.memo(function DataEntryCell({
    dataElement: de,
    categoryOptionCombo: coc,
}) {
    // This field name results in this structure for the form data object:
    // { [deId]: { [cocId]: value } }
    const fieldname = `${de.id}.${coc.id}`
    const { validate } = VALUE_TYPES[de.valueType]
    const { meta } = useField(fieldname, {
        validate,
        subscription: {
            valid: true,
            initial: true,
            invalid: true,
            active: true,
        },
    })
    const [lastSyncedValue, setLastSyncedValue] = useState(meta.initial)

    // Some values for file inputs to handle:
    const [isFileSynced, setIsFileSynced] = useState(false)
    const [isFileLoading, setIsFileLoading] = useState(false)

    const { mutate, isIdle, isLoading, isError } = useDataValueMutation()
    const [dataEntryContext] = useContextSelection()
    const metadataFetch = useMetadata()

    if (metadataFetch.isLoading || metadataFetch.isError) {
        return null
    }

    // gets de, co, ds, ou, and pe params for dataValues or dataValues/file
    const getDataValueParams = () => {
        const {
            dataSetId,
            orgUnitId,
            periodId,
            attributeOptionComboSelection,
        } = dataEntryContext

        const attributeComboId = getDataSetById(metadataFetch.data, dataSetId)
            .categoryCombo.id
        const isDefaultAttributeCombo = getCategoryComboById(
            metadataFetch.data,
            attributeComboId
        ).isDefault

        const dvParams = {
            de: de.id,
            co: coc.id,
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

    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { ...getDataValueParams(), value: value || '' },
            { onSuccess: () => setLastSyncedValue(value) }
        )
    }

    // todo: get data details (via getDataValue?)
    // todo: implement read-only cells

    // todo: refactor this into lower components
    const isFileInput =
        de.valueType === 'FILE_RESOURCE' || de.valueType === 'IMAGE'
    const isSynced = isFileInput
        ? !isFileLoading && isFileSynced
        : meta.valid && !isIdle && !isLoading && !isError

    const Input = getInputByDataElement(de)

    return (
        <td className={styles.dataEntryCell}>
            <ValidationTooltip fieldname={fieldname}>
                <InnerWrapper fieldname={fieldname} isSynced={isSynced}>
                    <Input
                        name={fieldname}
                        // disabled={true} (todo)
                        // props for most inputs:
                        syncData={syncData}
                        dataElement={de}
                        lastSyncedValue={lastSyncedValue}
                        // props for file inputs, which use different mutations:
                        getDataValueParams={getDataValueParams}
                        setIsFileSynced={setIsFileSynced}
                        setIsFileLoading={setIsFileLoading}
                    />
                </InnerWrapper>
            </ValidationTooltip>
        </td>
    )
})
DataEntryCell.propTypes = {
    categoryOptionCombo: PropTypes.shape({ id: PropTypes.string.isRequired })
        .isRequired,
    dataElement: PropTypes.shape({
        id: PropTypes.string.isRequired,
        valueType: PropTypes.string,
    }).isRequired,
}
