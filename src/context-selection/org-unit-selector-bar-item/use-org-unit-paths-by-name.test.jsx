/** @author Morten Svanæs */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import PropTypes from 'prop-types'
import React from 'react'
import createQueryFn from '../../app/query-client/create-query-fn.js'
import useOrgUnitPathsByName from './use-org-unit-paths-by-name.js'

function createWrapper(query) {
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                queryFn: createQueryFn({ query }),
                retry: false,
                cacheTime: 0,
            },
        },
    })
    function Wrapper({ children }) {
        return (
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        )
    }
    Wrapper.propTypes = { children: PropTypes.node.isRequired }
    return Wrapper
}

describe('organisation unit search', () => {
    it('does not request short trimmed queries or leave them loading after a search', async () => {
        const query = jest.fn(async () => ({
            organisationUnits: {
                organisationUnits: [{ path: '/root/match' }],
                pager: { pageCount: 1 },
            },
        }))
        const { result, rerender } = renderHook(
            ({ term }) => useOrgUnitPathsByName(term),
            { initialProps: { term: '  ab  ' }, wrapper: createWrapper(query) }
        )
        expect(query).not.toHaveBeenCalled()
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toBeUndefined()

        rerender({ term: '  abc  ' })
        await waitFor(() =>
            expect(result.current.data).toEqual(['/root/match'])
        )
        expect(query.mock.calls[0][0].organisationUnits.params.filter).toBe(
            'displayName:ilike:abc'
        )

        rerender({ term: '  ' })
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toBeUndefined()
        expect(result.current.hasNextPage).toBe(false)
        // Two supplementary Unicode characters must not count as four characters.
        rerender({ term: '😀😀' })
        expect(result.current.loading).toBe(false)
        expect(query).toHaveBeenCalledTimes(1)
    })

    it('does not let an older response replace a newer search', async () => {
        let resolveOld
        const oldResponse = new Promise((resolve) => {
            resolveOld = resolve
        })
        const query = jest.fn(({ organisationUnits: { params } }) =>
            params.filter.endsWith(':old')
                ? oldResponse
                : Promise.resolve({
                      organisationUnits: {
                          organisationUnits: [{ path: '/root/new' }],
                      },
                  })
        )
        const { result, rerender } = renderHook(
            ({ term }) => useOrgUnitPathsByName(term),
            { initialProps: { term: 'old' }, wrapper: createWrapper(query) }
        )
        rerender({ term: 'new' })
        await waitFor(() => expect(result.current.data).toEqual(['/root/new']))
        await act(async () => {
            resolveOld({
                organisationUnits: {
                    organisationUnits: [{ path: '/root/old' }],
                },
            })
            await oldResponse
        })
        expect(result.current.data).toEqual(['/root/new'])
    })

    it('fetches later eligible paths only when requested and isolates pages and filters', async () => {
        const firstPage = Array.from({ length: 50 }, (_, index) => ({
            path: `/other-root/unassigned${index}`,
        }))
        const query = jest.fn(async ({ organisationUnits: { params } }) => ({
            organisationUnits: {
                organisationUnits: params.filter.endsWith(':changed')
                    ? [{ path: '/root/changed' }]
                    : params.page === 1
                    ? firstPage
                    : [{ path: '/root/eligible' }],
                pager: {
                    pageCount: params.filter.endsWith(':changed') ? 1 : 2,
                },
            },
        }))
        const { result, rerender } = renderHook(
            ({ term, page }) => useOrgUnitPathsByName(term, page),
            {
                initialProps: { term: 'match', page: 1 },
                wrapper: createWrapper(query),
            }
        )
        await waitFor(() => expect(result.current.hasNextPage).toBe(true))
        expect(query).toHaveBeenCalledTimes(1)
        expect(query.mock.calls[0][0].organisationUnits.params).toMatchObject({
            paging: true,
            pageSize: 50,
            page: 1,
            order: 'id:asc',
        })
        expect(result.current.data).not.toContain('/root/eligible')

        rerender({ term: 'match', page: 2 })
        expect(result.current.data).toBeUndefined()
        await waitFor(() =>
            expect(result.current.data).toEqual(['/root/eligible'])
        )
        expect(result.current.hasNextPage).toBe(false)
        expect(query).toHaveBeenCalledTimes(2)

        rerender({ term: 'changed', page: 1 })
        expect(result.current.data).toBeUndefined()
        await waitFor(() =>
            expect(result.current.data).toEqual(['/root/changed'])
        )
        expect(result.current.hasNextPage).toBe(false)
    })
})
