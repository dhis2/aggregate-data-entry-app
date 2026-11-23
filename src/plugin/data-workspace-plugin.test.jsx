import { toSearch } from './data-workspace-plugin.jsx'

describe('toSearch', () => {
    it('sets the selection as the top bar would', () => {
        expect(
            toSearch({ dataSetId: 'ds', orgUnitId: 'ou', periodId: '202401' })
        ).toBe('?dataSetId=ds&orgUnitId=ou&periodId=202401')
    })
})
