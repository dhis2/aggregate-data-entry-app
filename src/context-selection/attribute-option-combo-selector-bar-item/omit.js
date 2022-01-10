export default function omit(key, collection) {
    const nextCollection = { ...collection }
    delete nextCollection[key]
    return nextCollection
}
