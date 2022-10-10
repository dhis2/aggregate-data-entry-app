import { useUserInfo, userInfoSelectors } from '../use-user-info/index.js'

export default function useCanUserEditFields() {
    const { data: userInfo } = useUserInfo()
    return userInfoSelectors.getCanEditFields(userInfo)
}
