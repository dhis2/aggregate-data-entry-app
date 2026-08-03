import { useMemo, useRef } from 'react'
import { useBlurredField, useValueStore } from '../../shared/index.js'
import { getFieldId } from '../get-field-id.jsx'

const transpose = (matrix) =>
    matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]))

/*
    This function takes sortedCOCs and reorders such that a category is put in the "row" and other cocs are put as columns
    // for each relevant category option

    e.g.
    /*
        [a1, b1, c1]
        [a1, b1, c2]
        [a1, b1, c3]
        [a1, b2, c1]
        [a1, b2, c2]
        [a1, b2, c3]
        [a2, b1, c1]
        [a2, b1, c2]
        [a2, b1, c3]
        [a2, b2, c1]
        [a2, b2, c2]
        [a2, b2, c3]
        
        [[a1, b1, c1],[a1, b1, c2],[a1, b1, c3],[a2, b1, c1],[a2, b1, c2],[a2, b1, c3]],
        [[a1, b2, c1],[a1, b2, c2],[a1, b2, c3],[a2, b2, c1],[a2, b2, c2],[a2, b2, c3]]
        
        the end matrix will have shape of rows: # category options in pivoted category, columns: product of remaining category options
        the finial result of this function is an array rows, columns of metadata ({de:id,coc:id}) in the order of the table, so that values can be retrieved
    */

const createPivotedMatrix = ({
    categories,
    sortedCOCs,
    pivotType,
    pivotedCategory,
    dataElements,
}) => {
    // create map from category options to categories
    if (!pivotedCategory || pivotType !== 'move_categories') {
        return null
    }
    const pivotedCategoryOptions = categories.find(
        (cc) => cc.id === pivotedCategory
    )?.categoryOptions
    if (!pivotedCategoryOptions) {
        return null
    }
    const pivotedCOCs = pivotedCategoryOptions.map((pco) =>
        sortedCOCs.filter((coc) => coc.categoryOptions.includes(pco))
    )
    return dataElements.flatMap((de) =>
        pivotedCOCs.map((row) => row.map((coc) => ({ coc: coc.id, de: de.id })))
    )
}

const createValueMatrix = ({
    dataElements,
    sortedCOCs,
    dataValues,
    pivotedMetadataMatrix,
}) => {
    if (pivotedMetadataMatrix) {
        return pivotedMetadataMatrix.map((row) =>
            row.map(({ de, coc }) => dataValues?.[de]?.[coc]?.value)
        )
    }
    return dataElements.map((de) =>
        sortedCOCs.map((coc) => dataValues?.[de?.id]?.[coc?.id]?.value)
    )
}
/**
 * Generates matrix (2d-array) of the values in a table, defined by dataElements and
 * the categoryOptionCombos.
 * @param {*} dataElements dataElements in order as rendered in table, these are "rows"
 * @param {*} sortedCOCs categoryOptionCombos in order as rendered in table, these are the "columns"
 * @param {*} pivotInfo {pivotType:'none', 'pivot', or 'move_categories', pivotedCategory, 'category' or undefined)
 */
export const useValueMatrix = ({
    dataElements,
    sortedCOCs,
    pivotType,
    pivotedCategory,
    categories,
}) => {
    const valueMatrixRef = useRef(null)
    const blurredField = useBlurredField()
    const dataValues = useValueStore((state) => state.getDataValues())

    const affectedFieldsLookup = useMemo(
        () =>
            new Set(
                dataElements.flatMap((de) =>
                    sortedCOCs.map((coc) => getFieldId(de.id, coc.id))
                )
            ),
        [dataElements, sortedCOCs]
    )

    const pivotedMetadataMatrix = useMemo(
        () =>
            createPivotedMatrix({
                categories,
                sortedCOCs,
                pivotedCategory,
                pivotType,
                dataElements,
            }),
        [categories, sortedCOCs, pivotedCategory, pivotType, dataElements]
    )

    return useMemo(() => {
        if (
            valueMatrixRef.current === null ||
            affectedFieldsLookup.has(blurredField)
        ) {
            valueMatrixRef.current = createValueMatrix({
                dataElements,
                sortedCOCs,
                dataValues,
                pivotedMetadataMatrix,
            })
        }
        if (!valueMatrixRef.current) {
            return undefined
        }
        if (pivotType === 'pivot') {
            return transpose(valueMatrixRef.current)
        }
        return valueMatrixRef.current
    }, [
        blurredField,
        affectedFieldsLookup,
        dataElements,
        dataValues,
        sortedCOCs,
        pivotType,
        pivotedMetadataMatrix,
        valueMatrixRef,
    ])
}
