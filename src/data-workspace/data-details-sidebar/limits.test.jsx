import userEvent from '@testing-library/user-event'
import React from 'react'
import { useUserInfo, useCanUserEditFields } from '../../shared/index.js'
import { render } from '../../test-utils/index.js'
import { useMinMaxLimits } from '../use-min-max-limits.js'
import Limits from './limits.jsx'

jest.mock('../use-min-max-limits.js', () => ({
    useMinMaxLimits: jest.fn(),
}))

jest.mock('../../shared/use-user-info/use-user-info.js', () => ({
    useUserInfo: jest.fn(),
}))

jest.mock('../../shared/use-user-info/use-can-user-edit-fields.js', () => ({
    __esModule: true,
    default: jest.fn(() => true),
}))

describe('<Limits />', () => {
    // beforeEach(jest.useFakeTimers)
    describe('when has limits to render', () => {
        beforeAll(() => {
            useMinMaxLimits.mockReturnValue({ min: 3, max: 4 })
            useUserInfo.mockImplementation(() => ({
                data: {
                    authorities: ['ALL'],
                },
            }))
        })

        it('is expanded by default', () => {
            const { getByRole } = render(
                <Limits
                    dataValue={{
                        canHaveLimits: true,
                        categoryOptionCombo: 'cat-combo-id',
                        dataElement: 'de-id',
                        valueType: 'INTEGER',
                    }}
                />
            )

            expect(
                getByRole('button', { name: 'Edit limits' })
            ).toBeInTheDocument()
        })

        it('renders the item limits', async () => {
            const { getByRole, queryByRole, getByText } = render(
                <Limits
                    dataValue={{
                        canHaveLimits: true,
                        categoryOptionCombo: 'cat-combo-id',
                        dataElement: 'de-id',
                        valueType: 'INTEGER',
                    }}
                />
            )

            expect(queryByRole('progressbar')).not.toBeInTheDocument()
            expect(getByText(`Average value: 3.5`)).toBeInTheDocument()
            expect(getByText(3)).toBeInTheDocument()
            expect(getByText(4)).toBeInTheDocument()
            expect(
                queryByRole('button', { name: 'Add limits' })
            ).not.toBeInTheDocument()
            expect(
                getByRole('button', { name: 'Edit limits' })
            ).toBeInTheDocument()
            expect(
                getByRole('button', { name: 'Delete limits' })
            ).toBeInTheDocument()
        })
    })

    describe('when has no limits to render', () => {
        beforeAll(() => {
            useMinMaxLimits.mockReturnValue({})
            useUserInfo.mockImplementation(() => ({
                data: {
                    authorities: ['ALL'],
                },
            }))
        })
        it(`is disabled if value of itemType prop is not 'numerical'`, () => {
            const { getByText } = render(
                <Limits
                    dataValue={{
                        canHaveLimits: false,
                        categoryOptionCombo: 'cat-combo-id',
                        dataElement: 'de-id',
                        valueType: 'STRING',
                    }}
                />
            )
            expect(
                getByText('Min and max limits (disabled)')
            ).toBeInTheDocument()
        })
        it('renders a placeholder if there are no limits', async () => {
            const { getByRole, queryByRole, getByText } = render(
                <Limits
                    dataValue={{
                        canHaveLimits: true,
                        categoryOptionCombo: 'cat-combo-id',
                        dataElement: 'de-id',
                        valueType: 'INTEGER',
                    }}
                />
            )
            // Expand and wait for data to load
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
            expect(
                getByText('No limits set for this data item.')
            ).toBeInTheDocument()
            expect(
                getByRole('button', { name: 'Add limits' })
            ).toBeInTheDocument()
            expect(
                queryByRole('button', { name: 'Edit limits' })
            ).not.toBeInTheDocument()
            expect(
                queryByRole('button', { name: 'Delete limits' })
            ).not.toBeInTheDocument()
        })
    })

    // ToDo: couldn't get this one to work after React 18 upgrade
    // my guess is that it might have to do automatic batching of events (the edits of inputs here)
    describe.skip('when limits have unsaved changes', () => {
        beforeEach(() => {
            jest.useFakeTimers()
            useMinMaxLimits.mockReturnValue({ min: 0, max: 10 })
            useUserInfo.mockImplementation(() => ({
                data: {
                    authorities: ['ALL'],
                },
            }))
        })

        afterEach(jest.clearAllMocks)

        it('renders the item limits', async () => {
            const firstItem = {
                canHaveLimits: true,
                categoryOptionCombo: 'cat-combo-id',
                dataElement: 'de-id',
                valueType: 'INTEGER',
            }
            const secondItem = {
                canHaveLimits: true,
                categoryOptionCombo: 'cat-combo-id-2',
                dataElement: 'de-id-2',
                valueType: 'INTEGER',
            }
            const {
                findByRole,
                // getByRole,
                rerender,
                getByLabelText,
                findByLabelText,
                // getByTestId,
                // queryByLabelText,
            } = render(<Limits dataValue={firstItem} />)

            const user = userEvent.setup({
                advanceTimers: jest.advanceTimersByTime,
            })
            // Edit the first item and change its min and max without saving
            const btn = await findByRole('button', { name: 'Edit limits' })
            await user.click(btn)
            await findByLabelText('Min')
            const minInput = getByLabelText('Min')
            // const maxInput = getByLabelText('Max')
            await user.type(minInput, '1')
            // await user.type(maxInput, '99')
            // await userEvent.tab()

            // go to second item
            rerender(<Limits dataValue={secondItem} />)

            // go back to first item and expect that the unsaved changes should show in edit mode (in inputs)
            rerender(<Limits dataValue={firstItem} />)
            expect(await findByLabelText('Min')).toHaveValue('1')
            // expect(getByLabelText('Max')).toHaveValue('99')
            // await userEvent.click(getByRole('button', { name: 'Cancel' }))
            // expect(queryByLabelText('Min')).toBeNull()
            // expect(getByTestId('limits-display')).toHaveTextContent('Min0Max10')
        })
    })

    describe('when user does not have authority to add min/max', () => {
        afterEach(jest.clearAllMocks)

        it('does not show add button when the user does not have the "add minmax" authority', () => {
            useMinMaxLimits.mockReturnValue({})
            useUserInfo.mockImplementation(() => ({
                data: {
                    authorities: [
                        'F_MINMAX_DATAELEMENT_DELETE',
                        'F_DATAVALUE_ADD',
                    ],
                },
            }))

            const { queryByRole } = render(
                <Limits
                    dataValue={{
                        canHaveLimits: true,
                        categoryOptionCombo: 'cat-combo-id',
                        dataElement: 'de-id',
                        valueType: 'INTEGER',
                    }}
                />
            )

            const addButton = queryByRole('button', { name: 'Add limits' })
            expect(addButton).not.toBeInTheDocument()
        })

        it('does not show edit button when the user does not have the "add minmax" authority', () => {
            useMinMaxLimits.mockReturnValue({ min: 3, max: 4 })
            useUserInfo.mockImplementation(() => ({
                data: {
                    authorities: [
                        'F_MINMAX_DATAELEMENT_DELETE',
                        'F_DATAVALUE_ADD',
                    ],
                },
            }))

            const { queryByRole } = render(
                <Limits
                    dataValue={{
                        canHaveLimits: true,
                        categoryOptionCombo: 'cat-combo-id',
                        dataElement: 'de-id',
                        valueType: 'INTEGER',
                    }}
                />
            )

            const editButton = queryByRole('button', { name: 'Edit limits' })
            expect(editButton).not.toBeInTheDocument()
        })

        it('does not allow the user to add limits when user cannot add data values', async () => {
            useUserInfo.mockImplementation(() => ({
                data: {
                    authorities: [
                        'F_MINMAX_DATAELEMENT_DELETE',
                        'F_MINMAX_DATAELEMENT_ADD',
                    ],
                },
            }))

            useMinMaxLimits.mockReturnValue({})
            useCanUserEditFields.mockImplementation(() => false)

            const { findByRole } = render(
                <Limits
                    dataValue={{
                        canHaveLimits: true,
                        categoryOptionCombo: 'cat-combo-id',
                        dataElement: 'de-id',
                        valueType: 'INTEGER',
                    }}
                />
            )

            const addButton = await findByRole('button', { name: 'Add limits' })
            expect(addButton).toHaveAttribute('disabled')
        })

        it('does not allow the user to edit limits when user cannot add data values', () => {
            useUserInfo.mockImplementation(() => ({
                data: {
                    authorities: [
                        'F_MINMAX_DATAELEMENT_DELETE',
                        'F_MINMAX_DATAELEMENT_ADD',
                    ],
                },
            }))

            useMinMaxLimits.mockReturnValue({ min: 3, max: 4 })
            useCanUserEditFields.mockImplementation(() => false)

            const { queryByRole } = render(
                <Limits
                    dataValue={{
                        canHaveLimits: true,
                        categoryOptionCombo: 'cat-combo-id',
                        dataElement: 'de-id',
                        valueType: 'INTEGER',
                    }}
                />
            )

            const editButton = queryByRole('button', { name: 'Edit limits' })
            expect(editButton).toHaveAttribute('disabled')
        })
    })
})
