import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import { render } from '../../../../test-utils/render.jsx'
import DebouncedSearchInput from '../../debounced-search-input.jsx'
import useOrgUnitPathsByName from '../../use-org-unit-paths-by-name.js'
import useUserOrgUnits from '../../use-user-org-units.js'
import { OrganisationUnitTree } from './organisation-unit-tree.jsx'

// Mirrors how the org unit selector bar item wires the search input
// to the tree, without its dependencies on metadata and context selection
// eslint-disable-next-line react/prop-types
const SearchableOrganisationUnitTree = ({ offlineLevels }) => {
    const [filter, setFilter] = useState('')
    const userOrgUnits = useUserOrgUnits()
    const orgUnitPathsByName = useOrgUnitPathsByName(filter)
    const [expanded, setExpanded] = useState([])

    const isLoading =
        userOrgUnits.loading ||
        (filter !== '' && !orgUnitPathsByName.called) ||
        orgUnitPathsByName.loading

    return (
        <>
            <DebouncedSearchInput initialValue={filter} onChange={setFilter} />
            {!isLoading && (
                <OrganisationUnitTree
                    singleSelection
                    roots={userOrgUnits.data}
                    filter={filter ? orgUnitPathsByName.data : []}
                    expanded={expanded}
                    handleExpand={({ path }) =>
                        setExpanded((prev) => [...prev, path])
                    }
                    handleCollapse={({ path }) =>
                        setExpanded((prev) => prev.filter((p) => p !== path))
                    }
                    onChange={() => {}}
                    offlineLevels={offlineLevels}
                    prefetchedOrganisationUnits={[]}
                />
            )}
        </>
    )
}

describe('OrganisationUnitTree', () => {
    const origError = console.error.bind(console)
    const errorMock = jest.fn()

    beforeEach(() => {
        console.error = errorMock
    })

    afterEach(() => {
        console.error = origError
        errorMock.mockClear()
    })

    it('should throw a prop-types error when "handleCollapse" is missing', () => {
        render(
            <OrganisationUnitTree
                roots="/A001"
                expanded={[]}
                onChange={() => {}}
                handleExpand={() => {}}
            />
        )

        expect(errorMock).toHaveBeenCalledTimes(1)
        expect(errorMock.mock.calls[0]).toEqual([
            'Warning: Failed %s type: %s%s',
            'prop',
            'Invalid prop `handleCollapse` supplied to `OrganisationUnitTree`, this prop is conditionally required but has value `undefined`. The condition that made this prop required is: `props => !!props.expanded || !!props.handleExpand`.',
            expect.any(String),
        ])
    })

    it('should throw a prop-types error when "handleExpand" is missing', () => {
        render(
            <OrganisationUnitTree
                roots="/A001"
                expanded={[]}
                onChange={() => {}}
                handleCollapse={() => {}}
            />
        )

        expect(errorMock).toHaveBeenCalledTimes(1)
        expect(errorMock.mock.calls[0]).toEqual([
            'Warning: Failed %s type: %s%s',
            'prop',
            'Invalid prop `handleExpand` supplied to `OrganisationUnitTree`, this prop is conditionally required but has value `undefined`. The condition that made this prop required is: `props => !!props.expanded || !!props.handleCollapse`.',
            expect.any(String),
        ])
    })

    it('should throw a prop-types error when "expanded" is missing', () => {
        render(
            <OrganisationUnitTree
                roots="/A001"
                onChange={() => {}}
                handleCollapse={() => {}}
                handleExpand={() => {}}
            />
        )

        expect(errorMock).toHaveBeenCalledTimes(1)
        expect(errorMock.mock.calls[0]).toEqual([
            'Warning: Failed %s type: %s%s',
            'prop',
            'Invalid prop `expanded` supplied to `OrganisationUnitTree`, this prop is conditionally required but has value `undefined`. The condition that made this prop required is: `props => !!props.handleExpand || !!props.handleCollapse`.',
            expect.any(String),
        ])
    })

    describe('filtering by name', () => {
        // The user is assigned to "Finland" (level 2), so the paths returned
        // by the API do not start with the user's root org unit id
        const world = { id: 'World000001', path: '/World000001', level: 1 }
        const finland = {
            id: 'Finland0001',
            path: '/World000001/Finland0001',
            displayName: 'Finland',
            level: 2,
            children: 3,
        }
        const finlandChildren = [
            {
                id: 'Moominvalle',
                path: `${finland.path}/Moominvalle`,
                displayName: 'Moomin valley',
                level: 3,
                children: 0,
            },
            {
                id: 'Moontown001',
                path: `${finland.path}/Moontown001`,
                displayName: 'Moon town',
                level: 3,
                children: 0,
            },
            {
                id: 'Helsinki001',
                path: `${finland.path}/Helsinki001`,
                displayName: 'Helsinki',
                level: 3,
                children: 0,
            },
        ]

        const dataForCustomProvider = {
            me: () => ({
                organisationUnits: [
                    {
                        id: finland.id,
                        level: finland.level,
                        path: finland.path,
                    },
                ],
            }),
            organisationUnits: (type, { id, params }) => {
                if (id === finland.id) {
                    return { children: finlandChildren }
                }

                if (params?.filter === `id:in:[${finland.id}]`) {
                    return { organisationUnits: [finland] }
                }

                const [, searchTerm] =
                    params?.filter?.match(/^displayName:ilike:(.*)$/) ?? []
                if (searchTerm) {
                    return {
                        organisationUnits: [world, finland, ...finlandChildren]
                            .filter(({ displayName }) =>
                                displayName
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            )
                            .map(({ path }) => ({ path })),
                    }
                }

                return Promise.reject(
                    new Error(`Unexpected query: ${JSON.stringify(params)}`)
                )
            },
        }

        it('should show the org units matching the filter term', async () => {
            render(
                <SearchableOrganisationUnitTree
                    offlineLevels={{ [finland.path]: [] }}
                />,
                {
                    dataForCustomProvider,
                }
            )

            await userEvent.type(
                await screen.findByPlaceholderText('Search org units'),
                'moo'
            )

            // expand the user's root org unit to reveal the matching children
            await userEvent.click(
                await screen.findByTestId(
                    'dhis2-uiwidgets-orgunittree-node-toggle'
                )
            )

            // the search input is debounced, so wait for the filter to apply
            await waitFor(() => {
                expect(screen.getByText('Moomin valley')).toBeInTheDocument()
                expect(screen.getByText('Moon town')).toBeInTheDocument()
                expect(screen.queryByText('Helsinki')).not.toBeInTheDocument()
            })
        })
    })
})
