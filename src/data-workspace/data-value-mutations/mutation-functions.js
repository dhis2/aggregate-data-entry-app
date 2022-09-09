import { useDataEngine } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { mutationKeys } from './mutation-key-factory.js'
// Note: the generic `data` and `params` functions are used in these
// mutation objects instead of destructuring each property because undefined
// properties cause errors, and it's better to handle logic to include or
// exclude properties if they're undefined in other functions to keep these
// simple (see use-data-value-params.js)
// (Ex: attribute properties should be omitted when the default AOC is used)

const SET_DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    data: (data) => data,
}
// This needs to be used for file-type data values; sending an empty 'value' prop
// doesn't work to clear the file
const DELETE_DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'delete',
    params: (params) => params,
}
// This endpoint expects a payload with a 'file' property and the normal DV
// mutation params
const UPLOAD_FILE_MUTATION = {
    resource: 'dataValues/file',
    type: 'create',
    data: (data) => data,
}

const createSharedMutateFn = (engine, mutationObj) =>
    function mutateFn(variables) {
        // get params for the mutation (de, co, ds, cc, cp) from the
        // `mutationKey`, which is set in the mutation options object and can
        // be accessed via `this`-context in the mutation function.
        // This saves passing `dataValueParams` everywhere
        const { mutationKey } = this
        const { params } = mutationKey[1]
        return engine.mutate(mutationObj, {
            variables: { ...params, ...variables },
        })
    }

/**
 * A mutation function is called with the `variables` object that is passed
 * to the `mutate` function that is returned from `useMutation`.
 *
 * These functions add data set context to data value mutations
 * (ds, pe, ou, [cc and cp]).
 * Therefore, when calling the resulting `mutate` function, supply a variables
 * object of the desired data to send, e.g. `{ value: 5 }`,
 * `{ file: 'file' }`, or `{ comment: 'this data is awesome' }`.
 */
function useSharedMutationFunction({ mutationObj }) {
    const engine = useDataEngine()
    const mutateFn = useMemo(
        () => createSharedMutateFn(engine, mutationObj),
        [engine, mutationObj]
    )

    return mutateFn
}

export function useSetDataValueMutationFunction() {
    return useSharedMutationFunction({
        mutationObj: SET_DATA_VALUE_MUTATION,
    })
}

export function useDeleteDataValueMutationFunction() {
    return useSharedMutationFunction({
        mutationObj: DELETE_DATA_VALUE_MUTATION,
    })
}

export function useUploadFileDataValueMutationFunction() {
    return useSharedMutationFunction({
        mutationObj: UPLOAD_FILE_MUTATION,
    })
}

export function setDataValueMutationDefaults(queryClient, engine) {
    queryClient.setMutationDefaults(mutationKeys.update(), {
        mutationFn: createSharedMutateFn(engine, SET_DATA_VALUE_MUTATION),
    }),
        queryClient.setMutationDefaults(mutationKeys.file(), {
            mutationFn: createSharedMutateFn(engine, UPLOAD_FILE_MUTATION),
        }),
        queryClient.setMutationDefaults(mutationKeys.delete(), {
            mutationFn: createSharedMutateFn(
                engine,
                DELETE_DATA_VALUE_MUTATION
            ),
        })
}
