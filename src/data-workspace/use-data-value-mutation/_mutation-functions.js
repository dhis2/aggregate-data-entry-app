import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback } from 'react'

// Note: the generic `data` and `params` functions are used in these
// mutation objects instead of destructuring each property because undefined
// properties cause errors, and it's better to handle logic to include or
// exclude properties if they're undefined in other functions to keep these
// simple
// (Ex: attribute properties should be omitted when the default AOC is used)

const SET_DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    data: (data) => data,
}
// This needs to be used for file-type data values; sending an empty 'value' prop
// doesn't work to clear the file (todo: replace when backend changes)
const DELETE_DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'delete',
    params: (params) => params,
}
const UPLOAD_FILE_MUTATION = {
    resource: 'dataValues/file',
    type: 'create',
    data: (data) => data,
}
const SET_DATA_VALUE_COMMENT_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    data: (data) => data,
}

/**
 * A mutation function is called with the `variables` object that is passed
 * to the `mutate` function that is returned from `useMutation`.
 * 
 * These functions add data set context to data value mutations
 * (ds, pe, ou, [cc and cp]).
 * Therefore, when calling the resulting `mutate` function, supply a variables
 * object of thedesired data to send, e.g. `{ value: 5 }`,
 * `{ value: 'id', file: 'file' }`, or `{ comment: 'this data is awesome' }`.  
 */
function useSharedMutationFunction({ mutationObj, dataValueParams }) {
    const engine = useDataEngine()

    return useCallback(
        (variables) =>
            engine.mutate(mutationObj, {
                variables: { ...dataValueParams, ...variables },
            }),
        [engine, mutationObj, dataValueParams]
    )
}

export function useSetDataValueMutationFunction(dataValueParams) {
    return useSharedMutationFunction({
        mutationObj: SET_DATA_VALUE_MUTATION,
        dataValueParams,
    })
}
export function useDeleteDataValueMutationFunction(dataValueParams) {
    return useSharedMutationFunction({
        mutationObj: DELETE_DATA_VALUE_MUTATION,
        dataValueParams,
    })
}
export function useUploadFileDataValueMutationFunction(dataValueParams) {
    return useSharedMutationFunction({
        mutationObj: UPLOAD_FILE_MUTATION,
        dataValueParams,
    })
}
export function useSetDataValueCommentMutationFunction(dataValueParams) {
    return useSharedMutationFunction({
        mutationObj: SET_DATA_VALUE_COMMENT_MUTATION,
        dataValueParams,
    })
}
