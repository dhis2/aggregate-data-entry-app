/** @author Morten Svanæs */
import { filterRootIds } from './filter-root-ids.js'

it('retains user roots at any hierarchy depth for matching result paths', () => {
    expect(
        filterRootIds(
            ['/country/district/facility', '/other/root'],
            ['district', 'root', 'unrelated']
        )
    ).toEqual(['district', 'root'])
})

it('does not confuse a root UID with a prefix of another UID', () => {
    expect(
        filterRootIds(['/country/districtTwo/facility'], ['district'])
    ).toEqual([])
})

it('keeps all configured roots when search is cleared', () => {
    expect(filterRootIds([], ['district', 'other'])).toEqual([
        'district',
        'other',
    ])
})
