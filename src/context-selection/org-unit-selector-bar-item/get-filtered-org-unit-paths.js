export default function getFilteredOrgUnitPaths({
    filter,
    orgUnitPathsByName,
    dataSetOrgUnitPaths,
}) {
    const dataSetPaths = dataSetOrgUnitPaths || []

    // If user didn't filter, return all possible paths
    if (!filter) {
        return dataSetPaths
    }

    const filterPaths = filter !== '' ? orgUnitPathsByName : []

    // Only return paths that are allowed by the data set
    return filterPaths.filter((path) =>
        dataSetPaths.some((curPath) => curPath.includes(path))
    )
}
