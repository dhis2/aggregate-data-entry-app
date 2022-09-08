import { useAlert, useDataEngine } from '@dhis2/app-runtime'
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
        dataSetId,
        periodId,
        orgUnitId,
        categoryComboId,
        categoryOptionIds,
        completed,
    }) => ({
        dataSet: dataSetId,
        period: periodId,
        orgUnit: orgUnitId,
        attribute: { combo: categoryComboId, options: categoryOptionIds },
        completed,
    }),
}

export default function useSetFormCompletionMutation() {
    const queryClient = useQueryClient()
    const engine = useDataEngine()
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const {
        attributeCombo: categoryComboId,
        attributeOptions: categoryOptionIds,
    } = useApiAttributeParams()

    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    const mutationFn = ({ completed }) => {
        const variables = {
            dataSetId,
            periodId,
            orgUnitId,
            categoryComboId,
            categoryOptionIds,
            completed,
        }

        return engine.mutate(MUTATION_SET_FORM_COMPLETION, { variables })
    }

    const dataValueSetQueryKey = useDataValueSetQueryKey()

    return useMutation(mutationFn, {
        retry: 0, // @TODO: Is this correct?
        mutationKey: dataValueSetQueryKey,
        onMutate: async ({ variables }) => {
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
                    complete: variables.completed,
                },
            }))

            const context = { previousDataValueSet, dataValueSetQueryKey }
            return context
        },
        onError: (event, _, context) => {
            showErrorAlert(
                `Something went wrong while deleting the min-max limits: ${event.message}`
            )

            queryClient.setQueryData(
                context.dataValueSetQueryKey,
                context.previousDataValueSet
            )
        },
    })
}
