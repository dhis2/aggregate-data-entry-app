const ALL_AUTHORITY = 'ALL'
const DELETE_MIN_MAX_AUTHORITY = 'F_MINMAX_DATAELEMENT_DELETE'
const ADD_MIN_MAX_AUTHORITY = 'F_MINMAX_DATAELEMENT_ADD'
const DATAVALUE_ADD = 'F_DATAVALUE_ADD'
const EDIT_EXPIRED = 'F_EDIT_EXPIRED'

export const getAuthorities = (userInfo) => userInfo.authorities

export const getCanDeleteMinMax = (userInfo) =>
    userInfo.authorities.some((auth) =>
        [DELETE_MIN_MAX_AUTHORITY, ALL_AUTHORITY].includes(auth)
    )

export const getCanAddMinMax = (userInfo) =>
    userInfo.authorities.some((auth) =>
        [ADD_MIN_MAX_AUTHORITY, ALL_AUTHORITY].includes(auth)
    )

export const getCanEditFields = (userInfo) =>
    !!userInfo?.authorities?.some((auth) => {
        return [DATAVALUE_ADD, ALL_AUTHORITY].includes(auth)
    })

export const getCanEditExpired = (userInfo) =>
    userInfo.authorities.some((auth) => {
        return [EDIT_EXPIRED, ALL_AUTHORITY].includes(auth)
    })
