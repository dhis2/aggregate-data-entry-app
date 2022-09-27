import { getPreFetchedChildren } from './get-pre-fetched-children.js'

describe('getPreFetchedChildren', () => {
    const offlineUnits = [
        {
            id: '1',
            path: '/1',
            displayName: 'layer 0, unit 1',
        },
        {
            id: '2',
            path: '/1/2',
            displayName: 'layer 1, unit 1',
        },
        {
            id: '3',
            path: '/1/3',
            displayName: 'layer 1, unit 2',
        },
        {
            id: '4',
            path: '/1/2/4',
            displayName: 'layer 2, branch 1, unit 1',
        },
        {
            id: '5',
            path: '/1/3/5',
            displayName: 'layer 2, branch 2, unit 1',
        },
    ]

    it('can handle complete parent paths', () => {
        const parentWithCompletePath = offlineUnits[1]
        const expected = [offlineUnits[3]]
        const actual = getPreFetchedChildren(
            offlineUnits,
            parentWithCompletePath
        )

        expect(actual).toEqual(expected)
    })

    it('can handle incomplete parent paths', () => {
        const parentWithIncompletePath = {
            ...offlineUnits[1],
            // Note: the complete path would be `1/2/`
            path: '/2',
        }
        const expected = [offlineUnits[3]]
        const actual = getPreFetchedChildren(
            offlineUnits,
            parentWithIncompletePath
        )

        expect(actual).toEqual(expected)
    })
})
