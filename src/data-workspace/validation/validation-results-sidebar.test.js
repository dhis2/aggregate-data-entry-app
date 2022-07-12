import {
    fireEvent,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import { rest } from 'msw'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import {
    metadata,
    validationMetadata,
    validationResult,
} from '../../mocks/responses/index.js'
import { server } from '../../mocks/server.js'
import { render } from '../../test-utils/render.js'
import ValidationResultsSidebar from './validation-results-sidebar.js'

describe('ValidationResultsSidebar', () => {
    beforeEach(() => {
        server.use(
            rest.get(
                'http://dhis2-tests.org/api/39/dataEntry/metadata',
                (req, res, ctx) => res(ctx.json(metadata))
            ),
            rest.get(
                'http://dhis2-tests.org/api/39/validation/dataSet/BfMAe6Itzgt',
                (req, res, ctx) => res(ctx.json(validationResult))
            ),
            rest.get(
                'http://dhis2-tests.org/api/39/validationRules',
                (req, res, ctx) => res(ctx.json(validationMetadata))
            )
        )
    })

    const waitForLoaderToDisappear = async () => {
        await waitForElementToBeRemoved(() =>
            screen.queryByText('Running validation...')
        )
    }
    const renderComponent = () => {
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
        server.use(
            rest.get(
                'http://dhis2-tests.org/api/39/validationRules',
                (req, res, ctx) => res.once(ctx.status(400))
            )
        )
        const { getByText } = renderComponent()

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
        server.use(
            rest.get(
                'http://dhis2-tests.org/api/39/validationRules',
                (req, res, ctx) => res.once(ctx.status(400))
            )
        )
        const { queryByText, getByText, findByText } = renderComponent()

        await waitForLoaderToDisappear()
        expect(
            getByText('There was a problem running validation')
        ).toBeDefined()

        fireEvent.click(getByText('Run validation again'))

        await findByText('Running validation...')
        await waitForLoaderToDisappear()
        expect(queryByText('There was a problem running validation')).toBeNull()
        expect(getByText('2 medium priority alerts')).toBeDefined()
    })
    it('should allow re-running validation', async () => {
        server.use(
            rest.get(
                'http://dhis2-tests.org/api/39/validation/dataSet/BfMAe6Itzgt',
                (req, res, ctx) =>
                    res.once(
                        ctx.json({
                            validationRuleViolations: [],
                            commentRequiredViolations: [],
                        })
                    )
            )
        )
        const { getByText } = renderComponent()

        await waitForLoaderToDisappear()
        expect(getByText('No validation alerts for this data.')).toBeDefined()
    })
})
