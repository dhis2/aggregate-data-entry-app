import { useIsReadOnly } from '../read-only/index.js'
import { useUserInfo, userInfoSelectors } from '../use-user-info/index.js'

export default function useCanUserEditFields() {
    const { data: userInfo } = useUserInfo()
    const readOnly = useIsReadOnly()
    return !readOnly && userInfoSelectors.getCanEditFields(userInfo)
}
