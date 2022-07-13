import { getIn } from 'final-form'
import { useMemo, useState, useEffect } from 'react'
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
    const form = useForm()
    const blurredField = useBlurredField()
    const [valueMatrix, setValueMatrix] = useState(
        createValueMatrix(dataElements, sortedCOCs, form.getState())
    )
    const affectedFieldsLookup = useMemo(
        () =>
            new Set(
                dataElements.flatMap((de) =>
                    sortedCOCs.map((coc) => `${de.id}.${coc.id}`)
                )
            ),
        [dataElements, sortedCOCs]
    )

    useEffect(() => {
        if (affectedFieldsLookup.has(blurredField)) {
            setValueMatrix(
                createValueMatrix(dataElements, sortedCOCs, form.getState())
            )
        }
    }, [blurredField, affectedFieldsLookup, dataElements, form, sortedCOCs])

    return valueMatrix
}
