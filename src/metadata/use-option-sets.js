import { useQueryClient, useQuery } from 'react-query'
import { createSelector } from 'reselect'
import queryKeys from './option-set-query-key-factory.js'
import { hashArraysInObject } from './utils.js'

const FETCH_ALL_THRESHOLD = 200

const useOptionSetsVersions = () => {
    return useQuery(queryKeys.allVersions, {
        refetchOnMount: false,
        select: (data) => {
            return data?.optionSets
        },
    })
}

const selectorFunction = createSelector(
    (data) => data,
    (data) => hashArraysInObject(data)?.optionSets
)
// This is the base query used to cache the optionSets
// staleTime: Infinity prevents this from refetching
// refetching is done by comparing versions
export const useAllOptionSets = () => {
    return useQuery(queryKeys.all, {
        meta: {
            persist: true,
        },
        staleTime: Infinity,
        cacheTime: Infinity,
        notifyOnChangeProps: ['data', 'error'],
        select: selectorFunction,
    })
}

export const useOptionSet = (optionSetId) => {
    const { data: optionSets } = useAllOptionSets()

    const optionSet = optionSets?.[optionSetId]
    return optionSet
}

const fetchAndUpdateOptionSets = async (
    queryClient,
    changedOptionSetIds,
    forceAll
) => {
    if (forceAll) {
        queryClient.prefetchQuery(queryKeys.all, {
            meta: {
                persist: true,
            },
        })
        return
    }

    const queryKey = queryKeys.byIds(changedOptionSetIds)
    const data = await queryClient.fetchQuery(queryKey)

    // update cache with fresh optionSets
    queryClient.setQueryData(queryKeys.all, (prevData) => {
        const updateOptionSets = [...data.optionSets]
        const prevOptionSets = prevData?.optionSets || []
        const newData = prevOptionSets.map((oldOS) => {
            const updateOptionsIndex = updateOptionSets.findIndex(
                (os) => os.id === oldOS.id
            )
            if (updateOptionsIndex > -1) {
                const [newOS] = updateOptionSets.splice(updateOptionsIndex, 1)
                return newOS
            }
            return oldOS
        })
        return {
            optionSets: newData.concat(updateOptionSets),
        }
    })
}

export const useOptionSetsPrefetch = () => {
    const queryClient = useQueryClient()
    const { isSuccess, data: optionSetVersions } = useOptionSetsVersions()
    const { isSuccess: allSuccess, data: allOptionSets } = useAllOptionSets()

    if (isSuccess && allSuccess) {
        const changedOptionSetIds = optionSetVersions
            .filter((versionOptionSet) => {
                const matchingOptionSet = allOptionSets[versionOptionSet.id]
                // refetch if not in cache or mismatching version
                const refetch =
                    matchingOptionSet === undefined ||
                    matchingOptionSet.version !== versionOptionSet.version
                return refetch
            })
            .map((os) => os.id)

        if (changedOptionSetIds.length > 0) {
            // fetch all if all optionSets have changed
            // or if above threshold - do not want too long url
            const fetchAll =
                changedOptionSetIds.length === allOptionSets.length ||
                changedOptionSetIds.length >= FETCH_ALL_THRESHOLD

            fetchAndUpdateOptionSets(queryClient, changedOptionSetIds, fetchAll)
        }
    }
}
