import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import { useCurrentItem } from '../../current-item-provider/index.js'
import {
    GenericInput,
    BooleanRadios,
    FileResourceInput,
    LongText,
    OptionSet,
    TrueOnlyCheckbox,
} from '../inputs/index.js'
import { useDataValueSet } from '../use-data-value-set.js'
import { useDataValueParams } from './use-data-value-params.js'
import { VALUE_TYPES } from './value-types.js'

function useCreateCurrentItem({ fieldname, de, coc, dataValueSet }) {
    const { input } = useField(fieldname)
    const { value } = input

    if (dataValueSet.data[de.id]?.[coc.id]) {
        return {
            ...dataValueSet.data[de.id]?.[coc.id],
            categoryOptionCombo: coc.id,
            name: de.displayName,
            code: de.code,
        }
    }

    return {
        categoryOptionCombo: coc.id,
        comment: null,
        dataElement: de.id,
        followup: false,
        lastUpdated: '',
        name: de.displayName,
        storedBy: null,
        value,
        code: '@TODO: Implement code',
    }
}

export function EntryFieldInput({
    fieldname,
    dataElement: de,
    categoryOptionCombo: coc,
    setSyncStatus,
}) {
    const { id: deId } = de
    const { id: cocId } = coc
    const dataValueParams = useDataValueParams({ deId, cocId })
    const dataValueSet = useDataValueSet()
    const { setCurrentItem } = useCurrentItem()
    const currentItem = useCreateCurrentItem({
        fieldname,
        de,
        coc,
        dataValueSet,
    })

    const onFocus = () => setCurrentItem(currentItem)

    const sharedProps = { fieldname, dataValueParams, setSyncStatus, onFocus }

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
            return <GenericInput {...sharedProps} valueType={de.valueType} />
        }
    }
}
EntryFieldInput.propTypes = {
    categoryOptionCombo: PropTypes.shape({
        id: PropTypes.string,
    }),
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
