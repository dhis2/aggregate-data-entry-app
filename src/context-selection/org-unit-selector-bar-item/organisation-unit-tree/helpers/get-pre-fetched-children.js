/*
 * A note about the current implementation:
 * We start with the user-org-units, which are fechted from the `/me`
 * endpoint. From this endpoint the `path` doesn't go all the way up
 * to the real org-unit root, but to the highest user org unit.
 * Then we pre-fetch a few levels of children for each user root
 * and for this we use the `/organisationUnits` endpoint. From this
 * endpoint the `path` that is returned goes all the way up to the
 * real org-unit root. So there is a mismatch in path definitions
 * between the two endpoints. As a result the same org-unit-could be
 * identified by 2 different paths, i.e. a/b/c/d and b/c/d are in fact
 * the same org-units. We can deal with this by shortening *all* paths
 * so they always start at the current parent's ID.
 */

const getSubPathStartingWithId = (path, id) =>
    // get substring starting with id and trim leading and trailing slashes
    path.substring(path.indexOf(id)).replace(/^\/|\/$/g, '')

export const getPreFetchedChildren = (offlineUnits, parent) => {
    if (!offlineUnits) {
        throw new Error('No offline organisation units available')
    }
    if (!parent) {
        throw new Error('No parent to fetch children from')
    }

    const parentSubPath = getSubPathStartingWithId(parent.path, parent.id)

    return offlineUnits
        .filter(
            ({ id, path }) =>
                `${parentSubPath}/${id}` ===
                getSubPathStartingWithId(path, parent.id)
        )
        .sort((a, b) => a.displayName > b.displayName)
}
