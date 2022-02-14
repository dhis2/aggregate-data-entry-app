import { IconMore16, colors } from '@dhis2/ui'
import cx from 'classnames'
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
import { useDataValueMutation } from './use-data-value-mutation.js'
import { useFieldNavigation } from './use-field-navigation.js'
import { ValidationTooltip } from './validation-tooltip.js'
import { getInputByDataElement, VALUE_TYPES } from './value-types.js'

/** Three dots or triangle in top-right corener of cell */
const SyncStatusIndicator = ({ isLoading, synced }) => {
    return (
        <div className={styles.topRightIndicator}>
            {isLoading ? (
                <IconMore16 color={colors.grey700} />
            ) : synced ? (
                <div className={styles.topRightTriangle} />
            ) : null}
        </div>
    )
}
SyncStatusIndicator.propTypes = {
    isLoading: PropTypes.bool,
    synced: PropTypes.bool,
}

/** Grey triangle in bottom left of cell */
const CommentIndicator = ({ isComment }) => {
    return (
        <div className={styles.bottomLeftIndicator}>
            {isComment && <div className={styles.bottomLeftTriangle} />}
        </div>
    )
}
CommentIndicator.propTypes = { isComment: PropTypes.bool }

export function DataEntryCell({ dataElement: de, categoryOptionCombo: coc }) {
    // This field name results in this structure for the form data object:
    // { [deId]: { [cocId]: value } }
    const fieldName = `${de.id}.${coc.id}`
    const { validate } = VALUE_TYPES[de.valueType]
    const { meta } = useField(fieldName, {
        validate,
        subscription: { valid: true, invalid: true, error: true, active: true },
    })

    const [lastSyncedValue, setLastSyncedValue] = useState(meta.initial)
    const { focusNext, focusPrev } = useFieldNavigation(fieldName)

    const { mutate, isIdle, isLoading, isError } = useDataValueMutation()
    const [dataEntryContext] = useContextSelection()
    const metadataFetch = useMetadata()

    if (metadataFetch.isLoading || metadataFetch.isError) {
        return null
    }

    const syncData = (value) => {
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

        const mutationVars = {
            de: de.id,
            co: coc.id,
            ds: dataSetId,
            ou: orgUnitId,
            pe: periodId,
            value: value || '', // Empty values need an empty string
        }
        // Add attribute params to mutation if relevant
        if (!isDefaultAttributeCombo) {
            // Get a ';'-separated listed of attribute options
            const attributeOptionIdList = Object.values(
                attributeOptionComboSelection
            ).join(';')
            mutationVars.cc = attributeComboId
            mutationVars.cp = attributeOptionIdList
        }

        // Here's where an error state could be set: ('onError')
        mutate(mutationVars, { onSuccess: () => setLastSyncedValue(value) })
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
    // todo: validate with `de.valueType` (wip)
    // todo: implement other input types for different value types (wip)
    // todo: implement read-only cells

    const synced = meta.valid && !isIdle && !isLoading && !isError
    const cellStateClassName = meta.invalid
        ? styles.invalid
        : synced
        ? styles.synced
        : null

    const Input = getInputByDataElement(de)

    return (
        <td className={styles.dataEntryCell}>
            <ValidationTooltip
                invalid={meta.invalid}
                error={meta.error}
                active={meta.active}
            >
                {(tooltipProps) => (
                    <div
                        className={cx(
                            styles.cellInnerWrapper,
                            cellStateClassName,
                            {
                                [styles.active]: meta.active,
                                [styles.disabled]: false, // todo
                            }
                        )}
                        {...tooltipProps}
                    >
                        <Input
                            name={fieldName}
                            dataElement={de}
                            // className={styles.input}
                            syncData={syncData}
                            lastSyncedValue={lastSyncedValue}
                            onKeyDown={onKeyDown}
                            // disabled={true}
                        />
                        <SyncStatusIndicator
                            isLoading={isLoading}
                            synced={synced}
                        />
                        {/* todo: show indicator if there is a comment */}
                        <CommentIndicator isComment={false} />
                    </div>
                )}
            </ValidationTooltip>
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
