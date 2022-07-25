import {
    fireEvent,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import {
    validationMetadata,
    validationResult,
} from '../../mocks/responses/index.js'
import { render } from '../../test-utils/render.js'
import ValidationResultsSidebar from './validation-results-sidebar.js'

describe('ValidationResultsSidebar', () => {
    const waitForLoaderToDisappear = async () => {
        await waitForElementToBeRemoved(() =>
            screen.queryByText('Running validation...')
        )
    }
    const renderComponent = (overrideDefaultData = {}) => {
        const dataForCustomProvider = {
            validationRules: () => {
                return validationMetadata
            },
            'validation/dataSet/BfMAe6Itzgt': () => {
                return validationResult
            },
            ...overrideDefaultData,
        }

        return render(<ValidationResultsSidebar />, {
            router: ({ children }) => (
                <MemoryRouter
                    initialEntries={[
                        '?dataSetId=BfMAe6Itzgt&orgUnitId=DiszpKrYNg8&periodId=202202',
                    ]}
                >
                    {children}
                </MemoryRouter>
            ),
            dataForCustomProvider,
        })
    }

    it('should render summary boxes with results', async () => {
        const { getByTestId } = renderComponent()

        await waitForLoaderToDisappear()

        expect(getByTestId('count-HIGH').textContent).toEqual('High1')
        expect(getByTestId('count-MEDIUM').textContent).toEqual('Medium2')
        expect(getByTestId('count-LOW').textContent).toEqual('Low0')
    })

    it('should render a unit for each priority group that has validation violations', async () => {
        const { findByText, queryByText } = renderComponent()

        await waitForLoaderToDisappear()

        expect(await findByText('2 medium priority alerts')).toBeDefined()
        expect(await findByText('1 high priority alert')).toBeDefined()
        expect(queryByText('low priority alert')).toBeNull()
    })

    it('should render the validation failures under each group', async () => {
        const { findByTestId } = renderComponent()

        await waitForLoaderToDisappear()

        const highPriorityGroup = await findByTestId('priority-group-HIGH')
        const mediumPriorityGroup = await findByTestId('priority-group-MEDIUM')
        expect(highPriorityGroup.textContent).toContain(
            'Slept under LLIN at measles (fixed < 1y) cannot be higher than measles doses given (fixed < 1y)'
        )
        expect(mediumPriorityGroup.textContent).toContain(
            'PCV 2 cannot be higher than PCV 1 doses given'
        )
        expect(mediumPriorityGroup.textContent).toContain(
            'Exclusive breastfeeding at time of penta 3 (outreach < 1y) cannot be higher than penta 3 doses given (outreach < 1y)'
        )
    })

    it('should render the validation failures the title and formula for each failure', async () => {
        const { findByTestId } = renderComponent()

        await waitForLoaderToDisappear()

        const highPriorityGroup = await findByTestId('priority-group-HIGH')
        const expectedValidationRule =
            '1 high priority alertSlept under LLIN at measles (fixed < 1y) cannot be higher than measles doses given (fixed < 1y)'
        const expectedFormula =
            'At Measles, slept under LLITN last night, <1 year Fixed (10) <= Measles, <1 year Fixed[34.292] (2)'

        expect(highPriorityGroup.textContent).toContain(expectedValidationRule)
        expect(highPriorityGroup.textContent).toContain(expectedFormula)
    })

    it('should display an error when validation fails', async () => {
        const overrideOptions = {
            validationRules: () => {
                return Promise.reject('some server-side error')
            },
        }
        const { getByText } = renderComponent(overrideOptions)

        await waitForLoaderToDisappear()
        expect(
            getByText('There was a problem running validation')
        ).toBeDefined()
        expect(
            getByText(
                'Validation could not be run for this data. Try again or contact your system administrator.'
            )
        ).toBeDefined()
    })
    it('should allow re-running validation', async () => {
        let count = 1
        const overrideOptions = {
            validationRules: () => {
                return new Promise((resolve, reject) => {
                    if (count++ === 1) {
                        return reject(
                            'server-side error the first time then it will pass on re-run'
                        )
                    } else {
                        return resolve(validationMetadata)
                    }
                })
            },
        }
        const { queryByText, getByText, findByText } =
            renderComponent(overrideOptions)

        await waitForLoaderToDisappear()
        expect(
            getByText('There was a problem running validation')
        ).toBeDefined()

        fireEvent.click(getByText('Run validation again'))

        await findByText('Running validation...')
        expect(queryByText('There was a problem running validation')).toBeNull()
        expect(getByText('2 medium priority alerts')).toBeDefined()
    })
    it('should show empty data', async () => {
        const overrideOptions = {
            'validation/dataSet/BfMAe6Itzgt': () => {
                return {
                    validationRuleViolations: [],
                    commentRequiredViolations: [],
                }
            },
        }
        const { getByText } = renderComponent(overrideOptions)

        await waitForLoaderToDisappear()
        expect(getByText('No validation alerts for this data.')).toBeDefined()
    })
})
