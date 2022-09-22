import { useQuery } from '@tanstack/react-query'

// query is set to match query from header bar component (for cache reuse)
const queryKey = [`/me?fields=authorities,avatar,email,name,settings`]

const queryOpts = {
    refetchOnMount: false,
    staleTime: 24 * 60 * 60 * 1000,
}

export const useUserInfo = () => {
    const userInfoQuery = useQuery(queryKey, queryOpts)
    return userInfoQuery
}
