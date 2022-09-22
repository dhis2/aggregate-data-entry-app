const ALL_AUTHORITY = 'ALL'
const DELETE_MIN_MAX_AUTHORITY = 'F_MINMAX_DATAELEMENT_DELETE'
const ADD_MIN_MAX_AUTHORITY = 'F_MINMAX_DATAELEMENT_ADD'

export const getAuthorities = (userInfo) => userInfo.authorities
export const getCanDeleteMinMax = (userInfo) =>
    userInfo.authorities.some((auth) =>
        [DELETE_MIN_MAX_AUTHORITY, ALL_AUTHORITY].includes(auth)
    )
export const getCanAddMinMax = (userInfo) =>
    userInfo.authorities.some((auth) =>
        [ADD_MIN_MAX_AUTHORITY, ALL_AUTHORITY].includes(auth)
    )
