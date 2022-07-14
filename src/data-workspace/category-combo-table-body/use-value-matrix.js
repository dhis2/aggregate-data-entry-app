import { getIn } from 'final-form'
import { useMemo, useRef } from 'react'
import { useForm } from 'react-final-form'
import { useBlurredField } from '../../shared/index.js'
import { getFieldId } from '../get-field-id.js'
const createValueMatrix = (dataElements, sortedCOCs, formState) =>
    dataElements.map((de) =>
        sortedCOCs.map((coc) =>
            getIn(formState.values, getFieldId(de.id, coc.id))
        )
    )

/**
 * Generates matrix (2d-array) of the values in a table, defined by dataElements and
 * the categoryOptionCombos.
 * @param {*} dataElements dataElements in order as rendered in table, these are "rows"
 * @param {*} sortedCOCs categoryOptionCombos in order as rendered in table, these are the "columns"
 */
export const useValueMatrix = (dataElements = [], sortedCOCs = []) => {
    const valueMatrixRef = useRef(null)
    const form = useForm()
    const blurredField = useBlurredField()
    const affectedFieldsLookup = useMemo(
        () =>
            new Set(
                dataElements.flatMap((de) =>
                    sortedCOCs.map((coc) => `${de.id}.${coc.id}`)
                )
            ),
        [dataElements, sortedCOCs]
    )

    return useMemo(() => {
        if (
            valueMatrixRef.current === null ||
            affectedFieldsLookup.has(blurredField)
        ) {
            valueMatrixRef.current = createValueMatrix(
                dataElements,
                sortedCOCs,
                form.getState()
            )
        }
        return valueMatrixRef.current
    }, [blurredField, affectedFieldsLookup, dataElements, form, sortedCOCs])
}
