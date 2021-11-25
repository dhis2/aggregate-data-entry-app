const useIsAuthorized = () => {
    // @TODO(auth): determine how to fetch/store authorities
    const authorities = ['ALL']

    return authorities.some(
        (authority) =>
            authority === 'ALL' || authority === 'M_dhis-web-approval'
    )
}

export default useIsAuthorized
