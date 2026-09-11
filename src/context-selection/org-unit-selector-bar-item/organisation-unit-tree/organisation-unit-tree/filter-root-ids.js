export const filterRootIds = (filter, rootIds) => {
    if (!filter?.length) {
        return rootIds
    }

    return rootIds.filter((rootId) => {
        const rootPath = `/${rootId}`
        return filter.some(
            (path) => path.endsWith(rootPath) || path.includes(`${rootPath}/`)
        )
    })
}
