import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { render } from '../../test-utils/render.jsx'
import OrgUnitSearchTree, {
    getSearchResultOfflineLevels,
} from './org-unit-search-tree.jsx'

const sierraLeone = { id: 'ImspTQPwCqd', path: '/ImspTQPwCqd', level: 1 }
const bombali = {
    id: 'fdc6uOvgoji',
    path: `${sierraLeone.path}/fdc6uOvgoji`,
    displayName: 'Bombali',
    level: 2,
    children: 1,
}
const bombaliSebora = {
    id: 'Bombalisebo',
    path: `${bombali.path}/Bombalisebo`,
    displayName: 'Bombali Sebora',
    level: 3,
    children: 1,
}
const bombaliSeboraChild = {
    id: 'Makeni00001',
    path: `${bombaliSebora.path}/Makeni00001`,
    displayName: 'Makeni Government Hospital',
    level: 4,
    children: 0,
}

const dataForCustomProvider = {
    organisationUnits: (type, { id, params }) => {
        if (id === bombali.id) {
            return { children: [bombaliSebora] }
        }

        if (id === bombaliSebora.id) {
            return { children: [bombaliSeboraChild] }
        }

        if (params?.filter === `id:in:[${bombali.id},${bombaliSebora.id}]`) {
            return { organisationUnits: [bombali, bombaliSebora] }
        }

        return Promise.reject(
            new Error(`Unexpected query: ${JSON.stringify({ id, params })}`)
        )
    },
}

const renderSearchTree = (props) =>
    render(
        <OrgUnitSearchTree
            orgUnits={[bombali, bombaliSebora]}
            offlineLevels={{ [sierraLeone.path]: [] }}
            prefetchedOrganisationUnits={[]}
            selected={[]}
            onChange={jest.fn()}
            {...props}
        />,
        { dataForCustomProvider }
    )

describe('OrgUnitSearchTree', () => {
    it('displays the matching org units as expanded roots', async () => {
        renderSearchTree()

        const tree = await screen.findByTestId('org-unit-selector-tree')

        // "Bombali Sebora" is displayed as a root and as a child of "Bombali"
        await waitFor(() => {
            expect(within(tree).getAllByText('Bombali')).toHaveLength(1)
            expect(within(tree).getAllByText('Bombali Sebora')).toHaveLength(2)
            expect(
                within(tree).getAllByText('Makeni Government Hospital')
            ).not.toHaveLength(0)
        })
    })

    it('selects a matching org unit when it is clicked', async () => {
        const onChange = jest.fn()
        renderSearchTree({ onChange })

        await userEvent.click(await screen.findByText('Bombali'))

        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({ id: bombali.id }),
            expect.anything()
        )
    })
})

describe('getSearchResultOfflineLevels', () => {
    it('uses the offline levels of the user org unit containing the result', () => {
        expect(
            getSearchResultOfflineLevels([bombali, bombaliSebora], {
                [sierraLeone.path]: [1, 2, 3],
            })
        ).toEqual({
            [bombali.path]: [1, 2, 3],
            [bombaliSebora.path]: [1, 2, 3],
        })
    })

    it('falls back to no offline levels', () => {
        expect(
            getSearchResultOfflineLevels([bombali], { '/otherRoot1': [1, 2] })
        ).toEqual({ [bombali.path]: [] })
        expect(getSearchResultOfflineLevels([bombali])).toEqual({
            [bombali.path]: [],
        })
    })
})
