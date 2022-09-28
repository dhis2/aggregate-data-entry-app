import { patchMissingDisplayName } from './patch-missing-display-name.js'

describe('patchMissingDisplayName', () => {
    it('should add an empty string as displayName if the prop is falsy', () => {
        const nodes = [
            { id: 'id1', noDisplayName: 'foo' },
            { id: 'id2', displayName: null },
            { id: 'id3', displayName: false },
            { id: 'id4', displayName: undefined },
            { id: 'id5', displayName: 'Should stay the same' },
        ]

        const actual = patchMissingDisplayName(nodes)
        const expected = [
            { id: 'id1', noDisplayName: 'foo', displayName: '' },
            { id: 'id2', displayName: '' },
            { id: 'id3', displayName: '' },
            { id: 'id4', displayName: '' },
            { id: 'id5', displayName: 'Should stay the same' },
        ]

        expect(actual).toEqual(expected)
    })
})
