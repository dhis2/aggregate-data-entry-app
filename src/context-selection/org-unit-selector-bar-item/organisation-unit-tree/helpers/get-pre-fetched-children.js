export const getPreFetchedChildren = (offlineUnits, parent) => {
    if (!offlineUnits) {
        throw new Error('No offline organisation units available')
    }
    if (!parent) {
        throw new Error('No parent to fetch children from')
    }

    return offlineUnits
        .filter((unit) => {
            const fullParentPath = `${parent.path}/`
            const isDescendant = unit.path.startsWith(fullParentPath)
            const isDirectDescendant =
                unit.path.replace(fullParentPath, '') === unit.id
            return isDescendant && isDirectDescendant
        })
        .sort((a, b) => a.displayName > b.displayName)
}
