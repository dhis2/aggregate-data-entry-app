import { QueryClient } from '@tanstack/react-query'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { EmbeddedContext, useDataValueSet } from '../shared/index.js'
import { Wrapper } from '../test-utils/index.js'
import {
    FollowSelection,
    SyncHostValues,
    toHostDataValues,
    toSearch,
} from './data-workspace-plugin.jsx'

jest.mock(
    '../shared/use-data-value-set/use-data-value-set-query-key.js',
    () => ({
        __esModule: true,
        default: jest.fn(() => ['dataEntry/dataValues', { params: {} }]),
    })
)

jest.mock('../shared/use-context-selection/use-is-valid-selection.js', () => ({
    useIsValidSelection: jest.fn(() => true),
}))

const dataValue = (value) => ({
    dataValues: [{ dataElement: 'de1', categoryOptionCombo: 'coc1', value }],
})

describe('toSearch', () => {
    it('sets the selection as the top bar would', () => {
        expect(
            toSearch({ dataSetId: 'ds', orgUnitId: 'ou', periodId: '202401' })
        ).toBe('?dataSetId=ds&orgUnitId=ou&periodId=202401')
    })
})

describe('toHostDataValues', () => {
    it('turns numbers into the strings fields expect', () => {
        expect(toHostDataValues(dataValue(12)).dataValues[0].value).toBe('12')
        expect(toHostDataValues(dataValue('7')).dataValues[0].value).toBe('7')
    })
})

describe('FollowSelection', () => {
    const Search = () => <p>{useLocation().search}</p>

    const renderAt = (search) => (
        <MemoryRouter initialEntries={['/?periodId=1']}>
            <FollowSelection search={search}>
                <Search />
            </FollowSelection>
        </MemoryRouter>
    )

    it('shows its children once the URL has the selection', async () => {
        const { rerender } = render(renderAt('?periodId=1'))
        expect(screen.getByText('?periodId=1')).toBeInTheDocument()

        rerender(renderAt('?periodId=2'))
        expect(await screen.findByText('?periodId=2')).toBeInTheDocument()
        expect(screen.queryByText('?periodId=1')).not.toBeInTheDocument()
    })
})

describe('SyncHostValues', () => {
    it('shows the values the host changes to', async () => {
        let hostDataValues = dataValue('1')
        // the test wrapper would make a new one with every render
        const queryClient = new QueryClient()
        const wrapper = ({ children }) => (
            <Wrapper dataForCustomProvider={{}} queryClient={queryClient}>
                <EmbeddedContext.Provider
                    value={{ readOnly: true, dataValues: hostDataValues }}
                >
                    <SyncHostValues dataValues={hostDataValues} />
                    {children}
                </EmbeddedContext.Provider>
            </Wrapper>
        )
        const value = (result) => result.current.data?.dataValues.de1.coc1.value

        const { result, rerender } = renderHook(useDataValueSet, { wrapper })
        await waitFor(() => expect(value(result)).toBe('1'))

        hostDataValues = dataValue('2')
        rerender()
        await waitFor(() => expect(value(result)).toBe('2'))
    })
})
