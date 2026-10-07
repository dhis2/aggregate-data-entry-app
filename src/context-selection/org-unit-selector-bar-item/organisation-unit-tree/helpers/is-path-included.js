/**
 * @param {string[]} includedPaths
 * @param {string} path
 * @returns {bool}
 */
export const isPathIncluded = (includedPaths, path) =>
    includedPaths.some((includedPath) => includedPath.includes(path))
