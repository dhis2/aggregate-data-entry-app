import { useQuery } from '@tanstack/react-query'

const segmenter =
    typeof Intl.Segmenter === 'function'
        ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
        : undefined

export function isSearchTermValid(value) {
    const term = value.trim()
    // Older browsers without Segmenter count Unicode code points, not UTF-16 units.
    const characters = segmenter ? segmenter.segment(term) : term
    let count = 0
    for (const character of characters) {
        if (character && ++count === 3) {
            return true
        }
    }
    return false
}

export default function useOrgUnitPathsByName(searchTerm, page = 1) {
    const term = searchTerm.trim()
    const enabled = isSearchTermValid(term)
    const queryKey = [
        'organisationUnits',
        {
            params: {
                fields: ['path'],
                filter: `displayName:ilike:${term}`,
                paging: true,
                pageSize: 50,
                page,
                order: 'id:asc',
            },
        },
    ]
    const { isFetching, isPaused, error, data } = useQuery(queryKey, {
        enabled,
    })
    return {
        loading: enabled && !data && isFetching,
        paused: enabled && isPaused,
        error: enabled ? error : null,
        data: enabled
            ? data?.organisationUnits.map(({ path }) => path)
            : undefined,
        hasNextPage:
            enabled &&
            !!data &&
            (data.pager?.pageCount !== undefined
                ? page < data.pager.pageCount
                : data.organisationUnits.length === 50),
    }
}
