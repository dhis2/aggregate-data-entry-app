import { useQuery } from '@tanstack/react-query'

// query is set to match query from header bar component (for cache reuse)
const queryKey = [`/me?fields=authorities,avatar,email,name,settings`]

const queryOpts = {
    refetchOnMount: false,
    staleTime: 24 * 60 * 60 * 1000,
}

const parseLocale = (unparsedLocale) => {
    if (typeof unparsedLocale !== 'string') {
        return 'en'
    }

    // while script is possible in DHIS2 locales, it is not supported in underlying multi-calendar-dates logic
    const [lng, region] = unparsedLocale?.replaceAll('_', '-').split('-')

    return region ? `${lng}-${region}` : lng
}

export const useUserInfo = () => {
    const userInfoQuery = useQuery(queryKey, queryOpts)
    // this maps java format locales like `pt_BR` to JS style `pt-BR`
    if (userInfoQuery?.data?.settings?.keyUiLocale) {
        userInfoQuery.data.settings.keyUiLocale = parseLocale(
            userInfoQuery.data.settings.keyUiLocale
        )
    }
    return userInfoQuery
}

const queryKeyUsername = [`/me?fields=username`]

const queryOptsUsername = {
    refetchOnMount: false,
    staleTime: 24 * 60 * 60 * 1000,
}

export const useUsername = () => {
    const usernameQuery = useQuery(queryKeyUsername, queryOptsUsername)
    return usernameQuery
}
