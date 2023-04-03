import { useQuery } from '@tanstack/react-query'

const queryKey = [`/me?fields=username,authorities,name,settings`]

const queryOpts = {
    refetchOnMount: false,
    staleTime: 24 * 60 * 60 * 1000,
}

export const useUserInfo = () => {
    const userInfoQuery = useQuery(queryKey, queryOpts)
    return userInfoQuery
}
