import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import { useSetRightHandPanel } from '../../right-hand-panel/index.js'
import {
    VALUE_TYPES,
    useSetHighlightedFieldIdContext,
} from '../../shared/index.js'
import { dataDetailsSidebarId } from '../constants.js'
import { useDataValueParams } from '../data-value-mutations/index.js'
import { focusNext, focusPrev } from '../focus-utils/index.js'
import {
    GenericInput,
    BooleanRadios,
    FileResourceInput,
    LongText,
    OptionSet,
    TrueOnlyCheckbox,
} from '../inputs/index.js'

function InputComponent({ sharedProps, de }) {
    // If this is an option set, return OptionSet component
    if (de.optionSet) {
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

InputComponent.propTypes = {
    de: PropTypes.shape({
        optionSet: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }),
        optionSetValue: PropTypes.any,
        valueType: PropTypes.string,
    }).isRequired,
    sharedProps: PropTypes.object.isRequired,
}

export function EntryFieldInput({
    fieldname,
    dataElement: de,
    categoryOptionCombo: coc,
    setSyncStatus,
    disabled,
}) {
    const setHighlightedFieldId = useSetHighlightedFieldIdContext()

    // used so we don't consume the "id" which
    // would cause this component to rerender
    const setRightHandPanel = useSetRightHandPanel()

    const { id: deId } = de
    const { id: cocId } = coc
    const dataValueParams = useDataValueParams({ deId, cocId })

    const onKeyDown = useCallback(
        (event) => {
            const { key, ctrlKey, metaKey } = event
            const ctrlXorMetaKey = ctrlKey ^ metaKey

            if (ctrlXorMetaKey && key === 'Enter') {
                setRightHandPanel(dataDetailsSidebarId)
            } else if (key === 'ArrowDown' || key === 'Enter') {
                event.preventDefault()
                focusNext()
            } else if (key === 'ArrowUp') {
                event.preventDefault()
                focusPrev()
            }
        },
        [setRightHandPanel]
    )

    const onFocus = useCallback(() => {
        setHighlightedFieldId({ de, coc })
    }, [de, coc, setHighlightedFieldId])

    const sharedProps = useMemo(
        () => ({
            fieldname,
            dataValueParams,
            disabled,
            setSyncStatus,
            onFocus,
            onKeyDown,
        }),
        [
            fieldname,
            dataValueParams,
            disabled,
            setSyncStatus,
            onFocus,
            onKeyDown,
        ]
    )

    return <InputComponent sharedProps={sharedProps} de={de} />
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
    disabled: PropTypes.bool,
    fieldname: PropTypes.string,
    setSyncStatus: PropTypes.func,
}
