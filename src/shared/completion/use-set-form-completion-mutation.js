import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useApiAttributeParams } from '../use-api-attribute-params.js'
import {
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../use-context-selection/index.js'
import { useDataValueSetQueryKey } from '../use-data-value-set/index.js'

const MUTATION_SET_FORM_COMPLETION = {
    resource: 'dataEntry/dataSetCompletion',
    type: 'create',
    data: ({
        ds: dataSetId,
        pe: periodId,
        ou: orgUnitId,
        cc: categoryComboId,
        co: categoryOptionIds,
        completed,
    }) => {
        return {
            dataSet: dataSetId,
            period: periodId,
            orgUnit: orgUnitId,
            attribute: { combo: categoryComboId, options: categoryOptionIds },
            completed,
        }
    },
}

const createMutateFn = (engine) =>
    function mutateFn(variables) {
        const { mutationKey } = this
        const { params } = mutationKey[1]
        return engine.mutate(MUTATION_SET_FORM_COMPLETION, {
            variables: { ...params, ...variables },
        })
    }

const createMutationKey = (params) => [
    'dataEntry/dataSetCompletion',
    { params, entity: 'dataSetCompletion' },
]

export default function useSetFormCompletionMutation() {
    const queryClient = useQueryClient()
    const engine = useDataEngine()
    const mutationFn = createMutateFn(engine)

    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    const dataValueSetQueryKey = useDataValueSetQueryKey()
    const { params } = dataValueSetQueryKey[1]
    const mutationKey = createMutationKey(params)

    return useMutation(mutationFn, {
        retry: 0, // @TODO: Is this correct?
        mutationKey,
        onMutate: async ({ variables }) => {
            const complete = variables.completed

            // Cancel any outgoing refetches (so they don't overwrite our optimistic delete)
            await queryClient.cancelQueries(dataValueSetQueryKey)

            // Snapshot the previous value
            const previousDataValueSet =
                queryClient.getQueryData(dataValueSetQueryKey)

            // Optimistically overwrite the completion status
            queryClient.setQueryData(dataValueSetQueryKey, () => ({
                ...previousDataValueSet,
                completeStatus: {
                    ...previousDataValueSet.completeStatus,
                    complete,
                },
            }))

            const context = {
                complete,
                previousDataValueSet,
                dataValueSetQueryKey,
            }
            return context
        },
        onError: (event, _, context) => {
            const alertMessage = i18n.t(
                `Something went wrong while setting the form's completion to "{{completed}}": {{errorMessage}}`,
                {
                    completed: context.complete,
                    errorMessage: event.message,
                    nsSeparater: '-:-',
                }
            )

            showErrorAlert(alertMessage)

            queryClient.setQueryData(
                context.dataValueSetQueryKey,
                context.previousDataValueSet
            )
        },
    })
}
