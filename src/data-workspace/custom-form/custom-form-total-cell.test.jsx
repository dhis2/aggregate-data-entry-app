import React from 'react'
import { useValueStore } from '../../shared/stores/data-value-store.js'
import { render } from '../../test-utils/index.js'
import { CustomFormTotalCell } from './custom-form-total-cell.jsx'

jest.mock('../../shared/stores/data-value-store.js', () => ({
    ...jest.requireActual('../../shared/stores/data-value-store.js'),
    useValueStore: jest.fn(),
}))

describe('CustomFormTotalCell', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the sum of values (3)', () => {
        useValueStore.mockReturnValueOnce({
            testDE: { abc: { value: 1 }, xyz: { value: 2 } },
        })
        const result = render(<CustomFormTotalCell dataElementId="testDE" />)
        expect(result.getByText('3')).toBeInTheDocument()
    })

    it('renders the sum of values (20)', () => {
        useValueStore.mockReturnValueOnce({
            testDE: { abc: { value: 15 }, xyz: { value: 5 } },
        })
        const result = render(<CustomFormTotalCell dataElementId="testDE" />)
        expect(result.getByText('20')).toBeInTheDocument()
    })
})
