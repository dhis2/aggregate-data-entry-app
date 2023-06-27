import { useQuery } from '@tanstack/react-query'

const queryKey = [`/me?fields=authorities,avatar,email,name,settings,username`]

const queryOpts = {
    refetchOnMount: false,
    staleTime: 24 * 60 * 60 * 1000,
}

export const useUserInfo = () => {
    const userInfoQuery = useQuery(queryKey, queryOpts)
    return userInfoQuery
}
