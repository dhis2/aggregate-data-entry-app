import { useConfig } from '@dhis2/app-runtime'
import { ReactFinalForm } from '@dhis2/ui'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'
import React from 'react'
import { useSetDataValueMutation, useUserInfo } from '../../shared/index.js'
import { render } from '../../test-utils/index.js'
import { DateInput } from './date-input.js'

jest.mock('../../shared/use-user-info/use-user-info.js', () => ({
    useUserInfo: jest.fn(),
}))

jest.mock('../../shared/data-value-mutations/data-value-mutations.js', () => ({
    useSetDataValueMutation: jest.fn(),
}))

jest.mock('@dhis2/app-runtime', () => {
    const originalModule = jest.requireActual('@dhis2/app-runtime')
    return {
        ...originalModule,
        useConfig: jest.fn(),
    }
})

const DE = 'rkAZZFGFEQ7'
const COC = 'HllvX50cXC0'

const { Form } = ReactFinalForm

const FormWrapper = ({ initialValues, children }) => (
    <Form
        onSubmit={() => {}}
        initialValues={initialValues}
        subscriptions={{}}
        keepDirtyOnReinitialize
    >
        {() => children}
    </Form>
)

FormWrapper.propTypes = {
    children: PropTypes.node,
    initialValues: PropTypes.object,
}

describe('date input field', () => {
    const props = {
        cocId: COC,
        deId: DE,
        disabled: undefined,
        fieldname: `${DE}.${COC}`,
        form: {},
        locked: false,
        onFocus: jest.fn(),
        onKeyDown: jest.fn(),
    }

    const mutate = jest.fn()

    const mockDate = new Date('25 July 2024 12:00:00 GMT+0300')

    beforeEach(() => {
        useUserInfo.mockReturnValue({
            data: {
                settings: {
                    keyUiLocale: 'en',
                },
            },
        })

        useSetDataValueMutation.mockReturnValue({
            mutate,
        })

        // 25th July 2024 (2024-07-25) - gregorian
        // 10, Shrawan 2081 (2081-04-10) - nepali
        // 18 Hamle 2016 (2016-11-18) - ethiopian
        jest.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime())
    })

    afterEach(jest.clearAllMocks)

    it('renders date input component (gregorian calendar)', async () => {
        useConfig.mockReturnValue({
            systemInfo: { calendar: 'gregorian' },
        })

        const { getByText, getByRole, getByTestId, queryByTestId } = render(
            <FormWrapper initialValues={{}}>
                <DateInput {...props} />
            </FormWrapper>
        )
        const calendarInputLabel = getByText('Pick a date')
        const calendarInput = getByRole('textbox')
        let calendar = queryByTestId('calendar')

        expect(calendarInputLabel).toBeInTheDocument()
        expect(calendarInput.value).toBe('')
        expect(calendar).not.toBeInTheDocument()

        // open calendar
        await userEvent.click(calendarInput)
        calendar = getByTestId('calendar')
        expect(calendar).toBeInTheDocument()

        // select today's date: 25th July 2024
        const today = getByText('25')
        expect(today.classList.contains('isToday')).toBe(true)
        await userEvent.click(today)

        // check that mutate function was called
        expect(mutate.mock.calls).toHaveLength(1)
        expect(mutate.mock.calls[0][0]).toHaveProperty('value', '2024-07-25')

        expect(calendarInput.value).toBe('2024-07-25')

        // clear date input
        const clearCalendarInputButton = getByText('Clear')
        await userEvent.click(clearCalendarInputButton)

        // check that mutate function was called again on clicking Clear button
        expect(mutate.mock.calls).toHaveLength(2)
        expect(mutate.mock.calls[1][0]).toHaveProperty('value', '')

        expect(calendarInput.value).toBe('')
    })

    it('allows user to navigate calendar component', async () => {
        useConfig.mockReturnValue({
            systemInfo: { calendar: 'gregorian' },
        })

        const { getByText, getByRole, getByTestId, getByLabelText } = render(
            <FormWrapper initialValues={{}}>
                <DateInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        await userEvent.click(calendarInput) // open calendar

        // previous month and previous year selection
        // select 20th June, 2023
        const prevMonthBtn = getByTestId('calendar-previous-month')
        await userEvent.click(prevMonthBtn) // June

        const prevYearBtn = getByLabelText('Go to previous year')
        await userEvent.click(prevYearBtn) // 2023

        let dateToSelect = getByText('20')
        await userEvent.click(dateToSelect)

        expect(calendarInput.value).toBe('2023-06-20')

        // check that mutate function was called
        expect(mutate.mock.calls).toHaveLength(1)
        expect(mutate.mock.calls[0][0]).toHaveProperty('value', '2023-06-20')

        // next month and next year selection
        // select 18th July, 2024
        await userEvent.click(calendarInput)

        const nextMonthBtn = getByTestId('calendar-next-month')
        await userEvent.click(nextMonthBtn) // July
        const nextYearBtn = getByLabelText('Go to next year')
        await userEvent.click(nextYearBtn) // 2024

        dateToSelect = getByText('18')
        await userEvent.click(dateToSelect)
        expect(calendarInput.value).toBe('2024-07-18')

        // check that mutate function was called again
        expect(mutate.mock.calls).toHaveLength(2)
        expect(mutate.mock.calls[1][0]).toHaveProperty('value', '2024-07-18')
    })

    it('populates the persisted date on load', async () => {
        useConfig.mockReturnValue({
            systemInfo: { calendar: 'gregorian' },
        })

        const { getByRole } = render(
            <FormWrapper initialValues={{ [DE]: { [COC]: '2021-04-22' } }}>
                <DateInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        expect(calendarInput.value).toBe('2021-04-22')
    })

    it('renders system set calendar, i.e. nepali', async () => {
        useConfig.mockReturnValue({
            systemInfo: { calendar: 'nepali' },
        })

        const { getByText, getByRole } = render(
            <FormWrapper initialValues={{}}>
                <DateInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        expect(calendarInput.value).toBe('')
        await userEvent.click(calendarInput)

        const today = getByText('10')
        expect(today.classList.contains('isToday')).toBe(true)
        await userEvent.click(today)

        expect(calendarInput.value).toBe('2081-04-10')
        // check that mutate function was called
        expect(mutate.mock.calls).toHaveLength(1)
        expect(mutate.mock.calls[0][0]).toHaveProperty('value', '2024-07-25')
    })

    it('populates the nepali equivalent of the persisted ISO date', async () => {
        jest.setSystemTime(new Date('2024-07-25T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'nepali' },
        })

        // 2021-04-22 ISO = 2078-01-09 nepali
        const { getByRole } = render(
            <FormWrapper
                initialValues={{ [DE]: { [COC]: '2021-04-22T13:17' } }}
            >
                <DateInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        expect(calendarInput.value).toBe('2078-01-09')
    })

    it('renders system set calendar, i.e. ethiopian', async () => {
        useConfig.mockReturnValue({
            systemInfo: { calendar: 'ethiopian' },
        })

        const { getByText, getByRole } = render(
            <FormWrapper initialValues={{}}>
                <DateInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        expect(calendarInput.value).toBe('')
        await userEvent.click(calendarInput)

        const today = getByText('18')
        expect(today.classList.contains('isToday')).toBe(true)
        await userEvent.click(today)

        expect(calendarInput.value).toBe('2016-11-18')
        // check that mutate function was called
        expect(mutate.mock.calls).toHaveLength(1)
        expect(mutate.mock.calls[0][0]).toHaveProperty('value', '2024-07-25')
    })

    it('populates the ethiopian equivalent of the persisted ISO date', async () => {
        jest.setSystemTime(new Date('2024-07-25T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'ethiopian' },
        })

        // 2021-04-22 ISO = 2013-08-14 ethiopian
        const { getByRole } = render(
            <FormWrapper
                initialValues={{ [DE]: { [COC]: '2021-04-22T13:17' } }}
            >
                <DateInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        expect(calendarInput.value).toBe('2013-08-14')
    })
})
