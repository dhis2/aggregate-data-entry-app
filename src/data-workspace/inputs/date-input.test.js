import { useConfig } from '@dhis2/app-runtime'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useUserInfo } from '../../shared/index.js'
import { render } from '../../test-utils/index.js'
import { FinalFormWrapper } from '../final-form-wrapper.js'
import { DateInput } from './date-input.js'

jest.mock('../../shared/use-user-info/use-user-info.js', () => ({
    useUserInfo: jest.fn(),
}))

jest.mock('@dhis2/app-runtime', () => {
    const originalModule = jest.requireActual('@dhis2/app-runtime')

    return {
        ...originalModule,
        useConfig: jest.fn(),
    }
})

describe('date input field', () => {
    const props = {
        cocId: 'HllvX50cXC0',
        deId: 'rkAZZFGFEQ7',
        disabled: undefined,
        fieldname: 'rkAZZFGFEQ7.HllvX50cXC0',
        form: {},
        locked: false,
        onFocus: jest.fn(),
        onKeyDown: jest.fn(),
    }

    beforeEach(() => {
        useUserInfo.mockImplementation(() => ({
            data: {
                settings: {
                    keyUiLocale: 'en',
                },
            },
        }))
    })

    afterEach(jest.clearAllMocks)

    it('renders date input component', async () => {
        useConfig.mockImplementation(() => ({
            systemInfo: { calendar: 'gregory' },
        }))
        const { getByText, getByRole, getByTestId, queryByTestId } = render(
            <DateInput {...props} />,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )
        const calendarInputLabel = getByText('Pick a date')
        const clearCalendarInputButton = getByText('Clear')
        const calendarInput = getByRole('textbox')
        let calendar = queryByTestId('calendar')

        expect(calendarInputLabel).toBeInTheDocument()
        expect(clearCalendarInputButton).toBeInTheDocument()
        expect(calendarInput.value).toBe('')
        expect(calendar).not.toBeInTheDocument()

        await userEvent.click(calendarInput)
        calendar = getByTestId('calendar')

        expect(calendar).toBeInTheDocument()
    })

    // todo: test calendar input for different calendars
})
