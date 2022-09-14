import React from 'react'
import useHighlightedField from '../../shared/highlighted-field/use-highlighted-field.js'
import { render } from '../../test-utils/render.js'
import DataDetailsSidebar from './data-details-sidebar.js'
jest.mock('../../shared/highlighted-field/use-highlighted-field.js')

const hide = jest.fn()
const renderComponent = () => {
    return render(<DataDetailsSidebar hide={hide} />)
}
const mockUseHighlightedFieldReturn = {
    dataElement: 'ixDKJGrGtFg',
    storedBy: 'admin',
    followUp: false,
    lastUpdated: '2022-08-26T15:16:37.438',
    valueType: 'INTEGER_ZERO_OR_POSITIVE',
    canHaveLimits: true,
    categoryOptionCombo: 'HllvX50cXC0',
    name: 'EXP Drugs Expense',
    code: 'EXP_DRUGS',
    value: 1,
}

describe('DataDetailsSideBar', () => {
    describe('Basic info', () => {
        it('should display the basic information', async () => {
            useHighlightedField.mockReturnValue({
                ...mockUseHighlightedFieldReturn,
            })

            const { queryByTestId } = renderComponent()

            expect(
                queryByTestId('data-details-sidebar-basic-information')
            ).toBeInTheDocument()
        })
    })
})
