import React from 'react'
import { render } from '../../test-utils/index.js'
import { useMinMaxLimits } from '../use-min-max-limits.js'
import Limits from './limits.js'

jest.mock('../use-min-max-limits.js', () => ({
    useMinMaxLimits: jest.fn(),
}))

describe('<Limits />', () => {
    describe('when has limits to render', () => {
        beforeAll(() => {
            useMinMaxLimits.mockReturnValue({ min: 3, max: 4 })
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
                getByText('Minimum and maximum limits (disabled)')
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
})
