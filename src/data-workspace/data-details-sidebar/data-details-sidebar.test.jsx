import React from 'react'
import useHighlightedField from '../../shared/highlighted-field/use-highlighted-field.js'
import { useUserInfo } from '../../shared/use-user-info/use-user-info.js'
import { render } from '../../test-utils/render.jsx'
import DataDetailsSidebar from './data-details-sidebar.jsx'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(() => ({
        systemInfo: { serverTimeZoneId: 'Etc/UTC', calendar: 'gregory' },
    })),
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

    describe('Indicator info', () => {
        const mockIndicatorHighlightedFieldReturn = {
            isIndicator: true,
            displayFormName: 'EXP Drugs Expense Ratio',
            description: 'Ratio of drug expenses to total expenses',
        }

        beforeAll(() => {
            useHighlightedField.mockReturnValue({
                ...mockIndicatorHighlightedFieldReturn,
            })
            useUserInfo.mockImplementation(() => ({
                data: {
                    authorities: ['ALL'],
                },
            }))
        })

        it('should only display the name and description', async () => {
            const { getByText, queryByText } = renderComponent()

            expect(
                getByText(mockIndicatorHighlightedFieldReturn.displayFormName, {
                    exact: false,
                })
            ).toBeInTheDocument()
            expect(
                getByText(
                    `Description: ${mockIndicatorHighlightedFieldReturn.description}`,
                    { exact: false }
                )
            ).toBeInTheDocument()

            expect(queryByText(/Code:/)).not.toBeInTheDocument()
            expect(queryByText(/Data element ID:/)).not.toBeInTheDocument()
            expect(
                queryByText(/Category option combo ID:/)
            ).not.toBeInTheDocument()
            expect(queryByText(/Last updated/)).not.toBeInTheDocument()
            expect(queryByText(/Marked for follow-up/)).not.toBeInTheDocument()

            // the other sidebar sections should not be rendered for indicators
            expect(queryByText('Comment')).not.toBeInTheDocument()
            expect(queryByText('Min and max limits')).not.toBeInTheDocument()
            expect(queryByText('History')).not.toBeInTheDocument()
            expect(queryByText('Audit log')).not.toBeInTheDocument()
        })
    })
})
