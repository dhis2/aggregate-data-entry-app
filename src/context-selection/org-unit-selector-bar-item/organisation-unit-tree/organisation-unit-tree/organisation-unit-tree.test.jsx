import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import { render } from '../../../../test-utils/render.jsx'
import useUserOrgUnits from '../../use-user-org-units.js'
import { OrganisationUnitTree } from './organisation-unit-tree.jsx'

// Renders the tree with the user's org units as roots,
// without dependencies on metadata and context selection
// eslint-disable-next-line react/prop-types
const FilteredOrganisationUnitTree = ({ filter, offlineLevels }) => {
    const userOrgUnits = useUserOrgUnits()
    const [expanded, setExpanded] = useState([])

    return (
        <>
            {!userOrgUnits.loading && (
                <OrganisationUnitTree
                    singleSelection
                    roots={userOrgUnits.data}
                    filter={filter}
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

    describe('filtering', () => {
        // The user is assigned to "Finland" (level 2), so the filtered paths
        // do not start with the user's root org unit id
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

                return Promise.reject(
                    new Error(`Unexpected query: ${JSON.stringify(params)}`)
                )
            },
        }

        it('should show the org units included in the filter', async () => {
            render(
                <FilteredOrganisationUnitTree
                    filter={[finlandChildren[0].path, finlandChildren[1].path]}
                    offlineLevels={{ [finland.path]: [] }}
                />,
                {
                    dataForCustomProvider,
                }
            )

            // expand the user's root org unit to reveal the matching children
            await userEvent.click(
                await screen.findByTestId(
                    'dhis2-uiwidgets-orgunittree-node-toggle'
                )
            )

            await waitFor(() => {
                expect(screen.getByText('Moomin valley')).toBeInTheDocument()
                expect(screen.getByText('Moon town')).toBeInTheDocument()
                expect(screen.queryByText('Helsinki')).not.toBeInTheDocument()
            })
        })

        it('should show the root org unit when it matches the filter term', async () => {
            // The only matching path ends with the root id
            // ("/World000001/Finland0001"), so there is no "/Finland0001/"
            // segment to match against
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
                'fin'
            )

            // expand the user's root org unit so we can tell when the filter
            // has been applied to its children
            await userEvent.click(
                await screen.findByTestId(
                    'dhis2-uiwidgets-orgunittree-node-toggle'
                )
            )

            // the search input is debounced, so wait for the filter to apply
            await waitFor(() => {
                expect(screen.getByText('Finland')).toBeInTheDocument()
                expect(
                    screen.getByText('No children match filter')
                ).toBeInTheDocument()
            })
        })
    })
})
