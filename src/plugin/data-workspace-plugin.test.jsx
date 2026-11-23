import { toSearch } from './data-workspace-plugin.jsx'

describe('toSearch', () => {
    it('sets the selection as the top bar would', () => {
        expect(
            toSearch({
                dataSetId: 'ds',
                orgUnitId: 'ou',
                periodId: '202401',
            })
        ).toBe('?dataSetId=ds&orgUnitId=ou&periodId=202401')
    })

    it('adds the attribute options, if any', () => {
        const search = toSearch({
            dataSetId: 'ds',
            orgUnitId: 'ou',
            periodId: '202401',
            attributeOptionComboSelection: { cat1: 'opt1', cat2: 'opt2' },
        })
        expect(
            new URLSearchParams(search).get('attributeOptionComboSelection')
        ).toBe('cat1-opt1_cat2-opt2')
    })

    it('leaves out an empty attribute option selection', () => {
        expect(
            toSearch({
                dataSetId: 'ds',
                orgUnitId: 'ou',
                periodId: '202401',
                attributeOptionComboSelection: {},
            })
        ).not.toContain('attributeOptionComboSelection')
    })
})
