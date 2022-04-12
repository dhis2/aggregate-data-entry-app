const createQueryFn = (engine) => {
    // https://react-query.tanstack.com/guides/query-keys
    return ({ queryKey }) => {
        const [resource, options] = queryKey
        const appRuntimeQuery = {
            [resource]: { resource },
        }

        if (options?.id) {
            appRuntimeQuery[resource].id = options.id
        }

        if (options?.params) {
            appRuntimeQuery[resource].params = options.params
        }

        return engine.query(appRuntimeQuery).then((data) => data[resource])
    }
}

export default createQueryFn
