import { useConfig } from '@dhis2/app-runtime'
import { ReactFinalForm } from '@dhis2/ui'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'
import React from 'react'
import { useSetDataValueMutation, useUserInfo } from '../../shared/index.js'
import { render } from '../../test-utils/index.js'
import { DateTimeInput } from './datetime-input.jsx'

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

        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.useRealTimers()
    })

    it('posts values back to server after date then time is selected', async () => {
        jest.setSystemTime(new Date('2024-07-25T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'gregorian' },
        })

        const { getByText, getByRole, getByTestId, queryByTestId } = render(
            <FormWrapper initialValues={{}}>
                <DateTimeInput {...props} />
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

        expect(calendarInput.value).toBe('2024-07-25')

        // check that mutate function was not called
        expect(mutate.mock.calls).toHaveLength(0)

        // set time value
        const timepicker = getByTestId('time-input')
        // the interaction for <input type='time' /> varies by browser
        // hence using fireEvent to set the value
        fireEvent.change(timepicker, { target: { value: '12:34' } })

        expect(mutate.mock.calls).toHaveLength(1)
        expect(mutate.mock.calls[0][0]).toHaveProperty(
            'value',
            '2024-07-25T12:34'
        )
    })

    it('posts values back to server after time then date is selected', async () => {
        jest.setSystemTime(new Date('2024-07-25T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'gregorian' },
        })

        const { getByText, getByRole, getByTestId, queryByTestId } = render(
            <FormWrapper initialValues={{}}>
                <DateTimeInput {...props} />
            </FormWrapper>
        )

        // set time value
        const timepicker = getByTestId('time-input')
        // the interaction for <input type='time' /> varies by browser
        // hence using fireEvent to set the value
        fireEvent.change(timepicker, { target: { value: '12:34' } })

        // check that mutate function was not called
        expect(mutate.mock.calls).toHaveLength(0)

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

        expect(calendarInput.value).toBe('2024-07-25')

        expect(mutate.mock.calls).toHaveLength(1)
        expect(mutate.mock.calls[0][0]).toHaveProperty(
            'value',
            '2024-07-25T12:34'
        )
    })

    it('populates the field value on initial load', async () => {
        jest.setSystemTime(new Date('2024-07-25T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'gregorian' },
        })

        const { getByRole, getByTestId } = render(
            <FormWrapper
                initialValues={{ [DE]: { [COC]: '2021-04-22T13:17' } }}
            >
                <DateTimeInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        expect(calendarInput.value).toBe('2021-04-22')

        const timepicker = getByTestId('time-input')
        expect(timepicker.value).toBe('13:17')
    })

    it('can be cleared with clear button', async () => {
        jest.setSystemTime(new Date('2024-07-25T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'gregorian' },
        })

        const { getByRole, getByTestId, getByText } = render(
            <FormWrapper
                initialValues={{ [DE]: { [COC]: '2021-04-22T13:17' } }}
            >
                <DateTimeInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        expect(calendarInput.value).toBe('2021-04-22')

        const timepicker = getByTestId('time-input')
        expect(timepicker.value).toBe('13:17')

        const clearButton = getByText('Clear')
        await userEvent.click(clearButton)

        // previous values should be cleared in UI
        expect(calendarInput.value).toBe('')
        expect(timepicker.value).toBe('')

        // and cleared value should be synced to the server
        expect(mutate.mock.calls).toHaveLength(1)
        expect(mutate.mock.calls[0][0]).toHaveProperty('value', '')
    })

    it('posts ISO date to backend with ethiopian calendar', async () => {
        // this is 2016-02-30 Ethopian
        jest.setSystemTime(new Date('2023-11-10T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'ethiopian' },
        })

        const {
            getByText,
            getAllByText,
            getByRole,
            getByTestId,
            queryByTestId,
        } = render(
            <FormWrapper initialValues={{}}>
                <DateTimeInput {...props} />
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

        // select today's date: 30 Tekemt 2016
        const today = getAllByText('30')[1] // the first 30 is the previous month
        expect(today.classList.contains('isToday')).toBe(true)
        await userEvent.click(today)

        expect(calendarInput.value).toBe('2016-02-30')

        // check that mutate function was not called
        expect(mutate.mock.calls).toHaveLength(0)

        // set time value
        const timepicker = getByTestId('time-input')
        // the interaction for <input type='time' /> varies by browser
        // hence using fireEvent to set the value
        fireEvent.change(timepicker, { target: { value: '12:34' } })

        expect(mutate.mock.calls).toHaveLength(1)

        // date is converted back to ISO equivalent before being sent to backend
        expect(mutate.mock.calls[0][0]).toHaveProperty(
            'value',
            '2023-11-10T12:34'
        )
    })

    it('populates the ethiopian equivalent of the persisted ISO date', async () => {
        jest.setSystemTime(new Date('2024-07-25T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'ethiopian' },
        })

        // 2021-04-22 ISO = 2013-08-14 ethiopian
        const { getByRole, getByTestId } = render(
            <FormWrapper
                initialValues={{ [DE]: { [COC]: '2021-04-22T13:17' } }}
            >
                <DateTimeInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        expect(calendarInput.value).toBe('2013-08-14')

        const timepicker = getByTestId('time-input')
        expect(timepicker.value).toBe('13:17')
    })

    it('posts ISO date to backend with nepali calendar', async () => {
        // this is 2080-02-32 Nepali
        jest.setSystemTime(new Date('2023-06-15T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'nepali' },
        })

        const { getByText, getByRole, getByTestId, queryByTestId } = render(
            <FormWrapper initialValues={{}}>
                <DateTimeInput {...props} />
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

        // select today's date: 32 Jestha 2080
        const today = getByText('32')
        expect(today.classList.contains('isToday')).toBe(true)
        await userEvent.click(today)

        expect(calendarInput.value).toBe('2080-02-32')

        // check that mutate function was not called
        expect(mutate.mock.calls).toHaveLength(0)

        // set time value
        const timepicker = getByTestId('time-input')
        // the interaction for <input type='time' /> varies by browser
        // hence using fireEvent to set the value
        fireEvent.change(timepicker, { target: { value: '12:34' } })

        expect(mutate.mock.calls).toHaveLength(1)

        // date is converted back to ISO equivalent before being sent to backend
        expect(mutate.mock.calls[0][0]).toHaveProperty(
            'value',
            '2023-06-15T12:34'
        )
    })

    it('populates the nepali equivalent of the persisted ISO date', async () => {
        jest.setSystemTime(new Date('2024-07-25T09:05:00.000Z'))

        useConfig.mockReturnValue({
            systemInfo: { calendar: 'nepali' },
        })

        // 2021-04-22 ISO = 2078-01-09 ethiopian
        const { getByRole, getByTestId } = render(
            <FormWrapper
                initialValues={{ [DE]: { [COC]: '2021-04-22T13:17' } }}
            >
                <DateTimeInput {...props} />
            </FormWrapper>
        )

        const calendarInput = getByRole('textbox')
        expect(calendarInput.value).toBe('2078-01-09')

        const timepicker = getByTestId('time-input')
        expect(timepicker.value).toBe('13:17')
    })
})
