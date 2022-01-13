import { IconMore16, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useMutation } from 'react-query'
import { useContextSelection } from '../../context-selection/index.js'
import { useMetadata } from '../metadata-context.js'
import { getDataSetById } from '../selectors.js'
import { useMutationFn } from '../use-mutation-fn.js'
import styles from './data-entry-cell.module.css'
import { getValidatorByValueType } from './field-validation.js'
import { useFieldNavigation } from './use-field-navigation.js'

// See docs: https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data.html#webapi_sending_individual_data_values
// ? Q: Params can either be sent as query params or form data, but not JSON (I think).
// ? Is one better?
const DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    params: ({ ...params }) => ({ ...params }),
}

export function DataEntryCell({ dataElement: de, categoryOptionCombo: coc }) {
    // This field name results in this structure for the form data object:
    // { [deId]: { [cocId]: value } }
    const fieldName = `${de.id}.${coc.id}`
    const validate = getValidatorByValueType(de.valueType)
    const { input, meta } = useField(fieldName, { validate })

    const [lastSyncedValue, setLastSyncedValue] = useState(meta.initial)
    const { focusNext, focusPrev } = useFieldNavigation(fieldName)

    const mutationFn = useMutationFn(DATA_VALUE_MUTATION)
    const { mutate, isIdle, isLoading, isError } = useMutation(mutationFn, {
        retry: 1,
    })
    const [dataEntryContext] = useContextSelection()
    const { metadata } = useMetadata()

    const syncData = () => {
        const {
            dataSetId,
            orgUnitId,
            periodId,
            attributeOptionComboSelection,
        } = dataEntryContext

        const attributeComboId = getDataSetById(metadata, dataSetId)
            .categoryCombo.id
        const isDefaultAttributeCombo =
            metadata.categoryCombos[attributeComboId].isDefault

        const mutationVars = {
            de: de.id,
            co: coc.id,
            ds: dataSetId,
            ou: orgUnitId,
            pe: periodId,
            value: input.value,
        }
        // Add attribute params to mutation if relevant
        if (!isDefaultAttributeCombo) {
            // convert ['<catId>:<catOptId>', ...] into 'catOptId1;catOptId2':
            const attributeOptionIdList = attributeOptionComboSelection
                .map((aoc) => aoc.split(':')[1])
                .join(';')
            mutationVars.cc = attributeComboId
            mutationVars.cp = attributeOptionIdList
        }

        mutate(mutationVars)
        setLastSyncedValue(input.value)
    }

    const onBlur = (event) => {
        // If this value has changed, sync it to server if valid
        if (meta.dirty && input.value !== lastSyncedValue && meta.valid) {
            syncData()
        }
        // Also invoke FinalForm's `onBlur`
        input.onBlur(event)
    }

    const onKeyDown = (event) => {
        const { key, shiftKey } = event
        if (key === 'Enter' && shiftKey) {
            // todo: open data item details
        } else if (key === 'ArrowDown' || key === 'Enter') {
            event.preventDefault()
            focusNext()
        } else if (key === 'ArrowUp') {
            event.preventDefault()
            focusPrev()
        }
        // tab and shift-tab on their own work as expected
    }

    // todo: get data details (via getDataValue?)
    // todo: on focus, set 'active cell' in context
    // todo: tooltip for invalid cells
    // todo: validate with `de.valueType` (started)
    // todo: implement other input types for different value types
    // todo: implement read-only cells

    const synced = meta.valid && !isIdle && !isLoading && !isError
    const inputStateClassName = meta.invalid
        ? styles.inputInvalid
        : synced
        ? styles.inputSynced
        : null

    return (
        <td className={styles.dataEntryCell}>
            <div className={styles.cellInnerWrapper}>
                <input
                    className={cx(styles.input, inputStateClassName)}
                    type="text"
                    {...input}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    // todo: disabled if 'readOnly'
                    // disabled={true}
                />
                <div className={styles.topRightIndicator}>
                    {isLoading ? (
                        <IconMore16 color={colors.grey700} />
                    ) : synced ? (
                        <div className={styles.topRightTriangle} />
                    ) : null}
                </div>
                <div className={styles.bottomLeftIndicator}>
                    {/* todo: show grey600 6x6 triangle if there is a comment */}
                    {false && <div className={styles.bottomLeftTriangle} />}
                </div>
            </div>
        </td>
    )
}
DataEntryCell.propTypes = {
    categoryOptionCombo: PropTypes.shape({ id: PropTypes.string.isRequired })
        .isRequired,
    dataElement: PropTypes.shape({
        id: PropTypes.string.isRequired,
        valueType: PropTypes.string,
    }).isRequired,
}
