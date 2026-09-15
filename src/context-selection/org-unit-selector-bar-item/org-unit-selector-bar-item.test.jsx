/** @author Morten Svanæs */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import OrganisationUnitSetSelectorBarItem from './org-unit-selector-bar-item.jsx'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useAlert: () => ({ show: jest.fn() }),
}))

jest.mock('tabbable', () => {
    const actual = jest.requireActual('tabbable')
    return {
        ...actual,
        // JSDOM has no layout; retain the library's focus order/disabled rules.
        tabbable: (container) =>
            actual.tabbable(container, { displayCheck: 'none' }),
    }
})

jest.mock('../../shared/index.js', () => ({
    selectors: { getDataSetById: () => ({ organisationUnits: ['match'] }) },
    useMetadata: () => ({ data: {} }),
    useDataSetId: () => ['dataset'],
    useOrgUnitId: () => [undefined, jest.fn()],
    useOrgUnit: () => ({}),
}))

jest.mock('./organisation-unit-tree/index.js', () => ({
    OrganisationUnitTree: () => null,
    OrganisationUnitTreeRootLoading: () => null,
    OrganisationUnitTreeRootError: () => null,
}))
jest.mock('./use-expanded-state.js', () => () => ({ expanded: [] }))
jest.mock('./use-prefetched-organisation-units.js', () => () => ({
    offlineOrganisationUnits: [],
    offlineLevels: {},
}))
jest.mock('./use-select-bar-item-value.js', () => () => '')
jest.mock('./use-user-org-units.js', () => () => ({ data: ['root'] }))
jest.mock('./use-org-unit-paths-by-name.js', () => ({
    __esModule: true,
    ...jest.requireActual('./use-org-unit-paths-by-name.js'),
    default: (term, page) => ({
        data: term ? (term === 'nothing' ? [] : ['/root/match']) : undefined,
        hasNextPage: page === 1,
        loading: false,
    }),
}))

async function openSearch(term = 'match') {
    const user = userEvent.setup()
    render(
        <>
            <button>Before selector</button>
            <OrganisationUnitSetSelectorBarItem />
            <button>After selector</button>
        </>
    )
    screen
        .getByRole('button', {
            name: 'Organisation unit Choose a organisation unit',
        })
        .focus()
    await user.keyboard('{Enter}')
    const input = screen.getByPlaceholderText('Search org units')
    expect(input).toHaveFocus()
    await user.keyboard(term)
    return { user, input }
}

it('allows keyboard paging and exits the popup at its forward boundary', async () => {
    const { user, input } = await openSearch()
    const next = await screen.findByRole('button', { name: 'Next page' })
    await user.tab()
    expect(next).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByText(/Page 2\./)).toBeVisible()
    expect(input).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveFocus()
    await user.tab()
    await waitFor(() =>
        expect(
            screen.queryByRole('group', { name: 'Organisation unit search' })
        ).not.toBeInTheDocument()
    )
})

it('allows Shift-Tab back to search and exits at its backward boundary', async () => {
    const { user, input } = await openSearch()
    await screen.findByRole('button', { name: 'Next page' })
    await user.tab()
    await user.tab({ shift: true })
    expect(input).toHaveFocus()
    await user.tab({ shift: true })
    await waitFor(() =>
        expect(
            screen.queryByRole('group', { name: 'Organisation unit search' })
        ).not.toBeInTheDocument()
    )
})

it('does not suggest paging when the search has no matches', async () => {
    await openSearch('nothing')
    expect(
        await screen.findByText('No organisation units could be found')
    ).toBeVisible()
    expect(
        screen.queryByRole('button', { name: 'Next page' })
    ).not.toBeInTheDocument()
    expect(
        screen.queryByRole('button', { name: 'Previous page' })
    ).not.toBeInTheDocument()
})
