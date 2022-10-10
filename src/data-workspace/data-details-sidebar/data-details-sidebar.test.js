import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import useHighlightedField from '../../shared/highlighted-field/use-highlighted-field.js'
import { useUserInfo } from '../../shared/use-user-info/use-user-info.js'
import { render } from '../../test-utils/render.js'
import DataDetailsSidebar from './data-details-sidebar.js'

jest.mock('../../shared/date/use-server-date-at-client-timezone.js', () => ({
    __esModule: true,
    default: jest.fn((date) => date),
}))

jest.mock('../../shared/highlighted-field/use-highlighted-field.js')

jest.mock('../../shared/use-user-info/use-user-info.js', () => ({
    useUserInfo: jest.fn(),
}))

describe('DataDetailsSideBar', () => {
    const hide = jest.fn()

    const dataValuesMock = jest.fn()
    const renderComponent = (overrideDefaultData = {}) => {
        const dataForCustomProvider = {
            dataValues: dataValuesMock,
            ...overrideDefaultData,
        }

        return render(<DataDetailsSidebar hide={hide} />, {
            router: ({ children }) => (
                <MemoryRouter
                    initialEntries={[
                        // expenditures form
                        '?dataSetId=rsyjyJmYD4J&orgUnitId=DiszpKrYNg8&periodId=2022April',
                    ]}
                >
                    {children}
                </MemoryRouter>
            ),
            dataForCustomProvider,
        })
    }
    let dataElementDefaultProps
    beforeEach(() => {
        dataElementDefaultProps = {
            dataElement: 'ixDKJGrGtFg',
            storedBy: 'admin',
            followUp: false,
            lastUpdated: '2022-08-26T15:16:37.438',
            valueType: 'INTEGER_ZERO_OR_POSITIVE',
            canHaveLimits: true,
            categoryOptionCombo: 'HllvX50cXC0',
            name: 'EXP Drugs Expense',
            code: 'EXP_DRUGS',
        }
        useHighlightedField.mockReturnValue({
            ...dataElementDefaultProps,
            value: '1',
        })
        useUserInfo.mockImplementation(() => ({
            data: {
                authorities: ['ALL'],
            },
        }))
    })
    afterEach(jest.clearAllMocks)
    describe('Basic info', () => {
        describe('Mark for followup', () => {
            let expectedMutationParams
            beforeEach(() => {
                expectedMutationParams = {
                    co: 'HllvX50cXC0',
                    de: 'ixDKJGrGtFg',
                    ds: 'rsyjyJmYD4J',
                    ou: 'DiszpKrYNg8',
                    pe: '2022April',
                }
            })
            it('should show allow marking an item for followup', async () => {
                const { getByText, findByText } = renderComponent()

                userEvent.click(getByText('Mark for follow-up'))
                await findByText('Unmark for follow-up')
                expect(getByText('Marked for follow-up')).toBeInTheDocument()

                expect(dataValuesMock).toHaveBeenCalledWith(
                    'create',
                    expect.objectContaining({
                        data: {
                            ...expectedMutationParams,
                            followUp: true,
                        },
                    }),
                    expect.anything()
                )
            })

            it('should show allow un-marking an item for followup', async () => {
                const { getByText, findByText } = renderComponent()

                userEvent.click(getByText('Mark for follow-up'))
                userEvent.click(await findByText('Unmark for follow-up'))
                await findByText('Mark for follow-up')

                expect(dataValuesMock).toHaveBeenCalledTimes(2)
                const [[, firstCall], [, secondCall]] =
                    dataValuesMock.mock.calls

                expect(firstCall.data).toEqual({
                    ...expectedMutationParams,
                    followUp: true,
                })
                expect(secondCall.data).toEqual({
                    ...expectedMutationParams,
                    followUp: false,
                })
            })
            it('should NOT show mark for follow up button if the data element is empty', async () => {
                useHighlightedField.mockReturnValue({
                    ...dataElementDefaultProps,
                    value: undefined,
                })
                const { getByText } = renderComponent()

                expect(getByText('Mark for follow-up')).toHaveAttribute(
                    'disabled'
                )
            })
        })
    })
})
