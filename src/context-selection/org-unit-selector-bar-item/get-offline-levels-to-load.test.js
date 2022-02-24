import getOfflineLevelsToLoad from './get-offline-levels-to-load.js'

test('creates an array of all org units and their corresponding offline levels to load', () => {
    const organisationUnitLevels = [
        { level: 1, offlineLevels: 3 },
        { level: 4, offlineLevels: 2 },
    ]

    const userOrganisationUnits = [
        { id: 'foo1', level: 1 },
        { id: 'foo2', level: 1 },
        { id: 'bar', level: 2 },
        { id: 'baz', level: 4 },
    ]

    const expected = [
        { id: 'foo1', offlineLevels: 3 },
        { id: 'foo2', offlineLevels: 3 },
        { id: 'baz', offlineLevels: 2 },
    ]

    const actual = getOfflineLevelsToLoad({
        organisationUnitLevels,
        userOrganisationUnits,
    })

    expect(actual).toEqual(expected)
})
