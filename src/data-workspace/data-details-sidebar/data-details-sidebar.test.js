import React from 'react'
import useHighlightedField from '../../shared/highlighted-field/use-highlighted-field.js'
import { useUserInfo } from '../../shared/use-user-info/use-user-info.js'
import { render } from '../../test-utils/render.js'
import DataDetailsSidebar from './data-details-sidebar.js'

jest.mock('../../shared/date/use-server-time-offset.js', () => ({
    __esModule: true,
    default: () => 0,
}))

jest.mock('../../shared/highlighted-field/use-highlighted-field.js')

jest.mock('../../shared/use-user-info/use-user-info.js', () => ({
    useUserInfo: jest.fn(),
}))

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
    categoryOptionComboName: '', //default
    name: 'EXP Drugs Expense',
    displayFormName: 'EXP Drugs Expense',
    code: 'EXP_DRUGS',
    value: 1,
}

describe('DataDetailsSideBar', () => {
    describe('Basic info', () => {
        beforeAll(() => {
            useHighlightedField.mockReturnValue({
                ...mockUseHighlightedFieldReturn,
            })
            useUserInfo.mockImplementation(() => ({
                data: {
                    authorities: ['ALL'],
                },
            }))
        })
        it('should display the basic information', async () => {
            const { getByText } = renderComponent()

            expect(
                getByText(`Details`, {
                    exact: false,
                })
            ).toBeInTheDocument()
        })
        it('should display the dataElement name', async () => {
            const { getByText } = renderComponent()

            expect(
                getByText(`${mockUseHighlightedFieldReturn.displayFormName}`, {
                    exact: false,
                })
            ).toBeInTheDocument()
        })

        it('should display the coc name if not default', async () => {
            const mockedHighlightedField = {
                ...mockUseHighlightedFieldReturn,
                categoryOptionComboName: 'Lab',
            }
            useHighlightedField.mockReturnValue({
                ...mockedHighlightedField,
            })
            const { getByText } = renderComponent()
            expect(
                getByText(
                    `${mockedHighlightedField.displayFormName} | ${mockedHighlightedField.categoryOptionComboName}`,
                    {
                        exact: false,
                    }
                )
            ).toBeInTheDocument()
        })
    })
})
