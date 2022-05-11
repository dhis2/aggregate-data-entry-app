import { getIn } from 'final-form'
import { useMemo } from 'react'
import { useFormState } from 'react-final-form'
/**
 * Generates matrix (2d-array) of the values in a table, defined by dataElements and
 * the categoryOptionCombos.
 * @param {*} dataElements dataElements in order as rendered in table, these are "rows"
 * @param {*} sortedCOCs categoryOptionCombos in order as rendered in table, these are the "columns"
 */
export const useValueMatrix = (dataElements, sortedCOCs) => {
    const { values } = useFormState({
        subscription: {
            values: true,
        },
    })

    console.log('use value matrix')

    if (!dataElements || !sortedCOCs) {
        return []
    }

    //console.log('calc')
    const ret = useMemo(
        () =>
            dataElements.map((de) => {
                console.log('calc')
                return sortedCOCs.map((coc) =>
                    getIn(values, `${de.id}.${coc.id}`)
                )
            }),
        [dataElements, sortedCOCs]
    )
    // return dataElements.map((de) => {
    //     console.log('calc')
    //     return sortedCOCs.map((coc) => getIn(values, `${de.id}.${coc.id}`))
    // })
    return ret
}
