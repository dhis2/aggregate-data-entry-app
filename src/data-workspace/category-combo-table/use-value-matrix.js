import { getIn } from 'final-form'
import { useMemo } from 'react'
import { useFormState } from 'react-final-form'
import { getFieldId } from '../get-field-id.js'
/**
 * Generates matrix (2d-array) of the values in a table, defined by dataElements and
 * the categoryOptionCombos.
 * @param {*} dataElements dataElements in order as rendered in table, these are "rows"
 * @param {*} sortedCOCs categoryOptionCombos in order as rendered in table, these are the "columns"
 */
export const useValueMatrix = (dataElements = [], sortedCOCs = []) => {
    const { values, active, hasValidationErrors, errors } = useFormState({
        subscription: {
            values: true,
            active: true,
            hasValidationErrors: true,
            errors: true,
        },
    })

    const matrix = useMemo(() => {
        return dataElements.map((de) =>
            sortedCOCs.map((coc) => {
                const fieldId = getFieldId(de.id, coc.id)
                // only include valid values
                if (hasValidationErrors && getIn(errors, fieldId)) {
                    return undefined
                }
                return getIn(values, fieldId)
            })
        )
        // active is updated onBlur, so this is-recalculated only when blurred
        // can change to `values` if we want to update on each value-change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataElements, sortedCOCs, active])
    return matrix
}
