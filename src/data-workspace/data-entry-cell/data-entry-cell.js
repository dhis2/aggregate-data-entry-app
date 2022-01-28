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
import { VALUE_TYPES } from './value-types.js'

const TopRightIndicator = ({ isLoading, synced }) => {
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
TopRightIndicator.propTypes = {
    isLoading: PropTypes.bool,
    synced: PropTypes.bool,
}

const BottomLeftIndicator = () => {
    // todo: render based on comment status
    return (
        <div className={styles.bottomLeftIndicator}>
            {false && <div className={styles.bottomLeftTriangle} />}
        </div>
    )
}

export function DataEntryCell({ dataElement: de, categoryOptionCombo: coc }) {
    // This field name results in this structure for the form data object:
    // { [deId]: { [cocId]: value } }
    const fieldName = `${de.id}.${coc.id}`
    const { validate } = VALUE_TYPES[de.valueType]
    // todo: subscription
    const { meta } = useField(fieldName, { validate })

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
    const inputStateClassName = meta.invalid
        ? styles.inputInvalid
        : synced
        ? styles.inputSynced
        : null

    const { Input } = VALUE_TYPES[de.valueType]

    return (
        <td className={styles.dataEntryCell}>
            <ValidationTooltip
                invalid={meta.invalid}
                error={meta.error}
                active={meta.active}
            >
                {(tooltipProps) => (
                    <div className={styles.cellInnerWrapper} {...tooltipProps}>
                        <Input
                            name={fieldName}
                            className={cx(styles.input, inputStateClassName)}
                            syncData={syncData}
                            lastSyncedValue={lastSyncedValue}
                            onKeyDown={onKeyDown}
                            // disabled={true}
                        />
                        <TopRightIndicator
                            isLoading={isLoading}
                            synced={synced}
                        />
                        {/* todo: show triangle if there is a comment */}
                        <BottomLeftIndicator />
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
