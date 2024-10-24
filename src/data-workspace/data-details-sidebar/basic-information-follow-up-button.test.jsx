import userEvent from '@testing-library/user-event'
import React from 'react'
import { useSetDataValueMutation } from '../../shared/data-value-mutations/data-value-mutations.js'
import useCanUserEditFields from '../../shared/use-user-info/use-can-user-edit-fields.js'
import { render } from '../../test-utils/render.jsx'
import FollowUpButton from './basic-information-follow-up-button.jsx'

jest.mock('../../shared/data-value-mutations/data-value-mutations.js', () => ({
    useSetDataValueMutation: jest.fn().mockImplementation(() => ({
        mutate: jest.fn(),
    })),
}))

jest.mock('../../shared/use-user-info/use-can-user-edit-fields.js')

useCanUserEditFields.mockImplementation(() => true)

const mockItemBase = {
    dataElement: 'ixDKJGrGtFg',
    storedBy: 'admin',
    followUp: false,
    lastUpdated: '2022-08-26T15:16:37.438',
    valueType: 'INTEGER_ZERO_OR_POSITIVE',
    canHaveLimits: true,
    categoryOptionCombo: 'HllvX50cXC0',
    name: 'EXP Drugs Expense',
    code: 'EXP_DRUGS',
    value: '1',
}

describe('FollowUpButton', () => {
    describe('when item is an empty field', () => {
        it(`should render a tooltip`, () => {
            const { getByTestId } = render(
                <FollowUpButton item={{ value: undefined }} />
            )

            expect(
                getByTestId('dhis2-uicore-tooltip-reference')
            ).toBeInTheDocument()
        })

        it(`should render a Mark for follow-up button as disabled`, () => {
            const { getByText } = render(
                <FollowUpButton item={{ value: undefined }} />
            )

            expect(getByText('Mark for follow-up')).toBeDisabled()
        })
    })

    describe('when item is passed', () => {
        it(`should not render a tooltip`, () => {
            const { queryByTestId } = render(
                <FollowUpButton item={{ ...mockItemBase, followUp: false }} />
            )

            expect(
                queryByTestId('dhis2-uicore-tooltip-reference')
            ).not.toBeInTheDocument()
        })

        it('should configure and set up useSetDataValueMutation', async () => {
            render(
                <FollowUpButton item={{ ...mockItemBase, followUp: false }} />
            )

            expect(useSetDataValueMutation).toHaveBeenCalledWith({
                deId: mockItemBase.dataElement,
                cocId: mockItemBase.categoryOptionCombo,
            })
        })
    })

    describe('when item is NOT marked for followup', () => {
        it('should display button text as "Mark for follow-up"', async () => {
            const { getByText } = render(
                <FollowUpButton item={{ ...mockItemBase, followUp: false }} />
            )

            expect(getByText('Mark for follow-up')).toBeInTheDocument()
        })

        describe('when clicking Mark for followup', () => {
            it(`should set the value of followUp to true`, () => {
                const mutate = jest.fn()

                useSetDataValueMutation.mockImplementation(() => ({
                    mutate,
                }))

                const { getByText } = render(
                    <FollowUpButton
                        item={{ ...mockItemBase, followUp: false }}
                    />
                )

                userEvent.click(getByText('Mark for follow-up'))
                expect(mutate).toHaveBeenCalledWith({
                    followUp: true,
                })
            })
        })
    })

    describe('when item is marked for followup', () => {
        it('should display button text as "Unmark for follow-up"', async () => {
            const { getByText } = render(
                <FollowUpButton item={{ ...mockItemBase, followUp: true }} />
            )

            expect(getByText('Unmark for follow-up')).toBeInTheDocument()
        })

        describe('when clicking Mark for followup', () => {
            it(`should set the value of followUp to true`, () => {
                const mutate = jest.fn()

                useSetDataValueMutation.mockImplementation(() => ({
                    mutate,
                }))

                const { getByText } = render(
                    <FollowUpButton
                        item={{ ...mockItemBase, followUp: true }}
                    />
                )

                userEvent.click(getByText('Unmark for follow-up'))

                expect(mutate).toHaveBeenCalledWith({
                    followUp: false,
                })
            })
        })
    })
    describe('when user cannot edit field', () => {
        beforeAll(() => {
            useCanUserEditFields.mockReturnValue(false)
        })
        it(`should render a tooltip`, () => {
            const { getByTestId } = render(
                <FollowUpButton item={{ value: mockItemBase }} />
            )

            expect(
                getByTestId('dhis2-uicore-tooltip-reference')
            ).toBeInTheDocument()
        })
        it(`should render a Mark for follow-up button as disabled`, () => {
            const { getByText } = render(
                <FollowUpButton item={{ value: mockItemBase }} />
            )

            expect(getByText('Mark for follow-up')).toBeDisabled()
        })
    })
})
