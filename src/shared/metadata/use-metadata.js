import { useDataEngine } from '@dhis2/app-runtime'
import { useQuery } from '@tanstack/react-query'
import { createSelector } from 'reselect'
import { fetchMetadata } from './fetch-metadata.js'
import { hashArraysInObject } from './utils.js'

const selectorFunction = createSelector(
    (data) => data,
    (data) => hashArraysInObject(data)
)

// Previously this fetched the bespoke `/dataEntry/metadata` endpoint, which
// caused an N+1 query explosion server-side (DHIS2-21757). It now rebuilds the
// same metadata client-side from flat, per-type requests to the standard
// endpoints (see fetch-metadata.js). The return shape is unchanged, so every
// consumer and selector is untouched.
const queryKey = ['dataEntryMetadata']

export const useMetadata = () => {
    const engine = useDataEngine()

    const metadataQuery = useQuery(queryKey, () => fetchMetadata(engine), {
        refetchOnMount: false,
        select: selectorFunction,
        staleTime: 24 * 60 * 60 * 1000,
        // Persist the preloaded metadata to IndexedDB so it survives reloads and
        // is available offline (DHIS2-21757: the endpoint's purpose is offline
        // preloading; the previous query set no meta.persist, so metadata only
        // ever survived in the service-worker runtime cache).
        meta: { persist: true },
    })

    return metadataQuery
}
