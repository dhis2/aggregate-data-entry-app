import { useQueryClient, useQuery } from 'react-query'
import keys from './option-set-query-key-factory.js'
import { hashArraysInObject } from './utils.js'

const FETCH_ALL_THRESHOLD = 200

const useOptionSetsVersions = () => {
    return useQuery(keys.allVersions, {
        refetchOnMount: false,
    })
}

// This is the base query used to cache the optionSets
// staleTime: Infinity prevents this from refetching
// refetching is done by comparing versions
export const useAllOptionSets = () => {
    return useQuery(keys.all, {
        meta: {
            persist: true,
        },
        staleTime: Infinity,
        cacheTime: Infinity,
        notifyOnChangeProps: ['data', 'error'],
        select: (data) => {
            console.log({ data })
            const hashed = hashArraysInObject(data)
            console.log({ hashed })
            return hashed
        },
    })
}

export const useOptionSet = (optionSetId) => {
    const optionSets = useAllOptionSets()
    return optionSets[optionSetId]
}

const fetchAndUpdateOptionSets = async (
    queryClient,
    changedOptionSetIds,
    forceAll
) => {
    if (forceAll) {
        queryClient.prefetchQuery(keys.all, {
            meta: {
                persist: true,
            },
        })
        return
    }

    const queryKey = keys.byIds(changedOptionSetIds)
    const data = await queryClient.fetchQuery(queryKey, {
        cacheTime: 5 * 60 * 1000,
    })

    // update cache with fresh optionSets
    queryClient.setQueryData(keys.all, (prevData) => {
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
    const { isSuccess, data: optionSetVersionsData } = useOptionSetsVersions()
    const { isSuccess: allSuccess, data: allOptionSetsData } =
        useAllOptionSets()

    if (isSuccess && allSuccess) {
        const { optionSets: optionSetVersions } = optionSetVersionsData
        const { optionSets: allOptionSets } = allOptionSetsData

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
            const fetchAll =
                changedOptionSetIds.length === allOptionSets.length ||
                changedOptionSetIds.length >= FETCH_ALL_THRESHOLD

            fetchAndUpdateOptionSets(queryClient, changedOptionSetIds, fetchAll)
        }
    }
}
