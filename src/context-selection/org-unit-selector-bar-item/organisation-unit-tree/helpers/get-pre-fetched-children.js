export const getPreFetchedChildren = (offlineUnits, parent) => {
    if (!offlineUnits) {
        throw new Error('No offline organisation units available')
    }
    if (!parent) {
        throw new Error('No parent to fetch children from')
    }

    const fullParentPath = `${parent.path}/`

    return offlineUnits
        .filter(({ id, path }) => {
            const unitPathFromUserRoot = path.substring(path.indexOf(parent.id))
            const fullUnitPath = `/${unitPathFromUserRoot}`
            const isDescendant = fullUnitPath.startsWith(fullParentPath)
            const isDirectDescendant =
                fullUnitPath.replace(fullParentPath, '') === id
            return isDescendant && isDirectDescendant
        })
        .sort((a, b) => a.displayName > b.displayName)
}
