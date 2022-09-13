import loadOfflineLevel, {
    QUERY_ORG_CHILDREN_FROM_UI,
} from './load-offline-level.js'
import { QUERY_ORG_UNIT_FROM_UI } from './load-org-unit.js'

describe('loadOfflineLevel', () => {
    const query = jest.fn()
    const dataEngine = { query }

    it('should load 2 org units', async () => {
        query.mockImplementation((query, options) => {
            const { params } = query.orgUnit
            const { variables } = options
            const { id } = variables

            if (id === 'foo' && typeof params === 'function') {
                return {
                    orgUnit: {
                        id: 'foo',
                        path: '/foo',
                        children: 1,
                    },
                }
            } else if (id === 'foo') {
                return {
                    orgUnit: {
                        children: [
                            {
                                id: 'bar',
                                displayName: 'Org unti bar',
                                path: '/foo/bar',
                            },
                        ],
                    },
                }
            } else if (id === 'bar' && typeof params === 'function') {
                return {
                    orgUnit: {
                        id: 'bar',
                        path: '/foo/bar',
                        children: 0,
                    },
                }
            }

            throw new Error(
                `Unexpected input: ${JSON.stringify(
                    { query, options },
                    null,
                    2
                )}`
            )
        })

        await loadOfflineLevel({ dataEngine, id: 'foo', offlineLevels: 1 })

        expect(query).toHaveBeenCalledTimes(3)
        expect(query).toHaveBeenNthCalledWith(1, QUERY_ORG_UNIT_FROM_UI, {
            variables: { id: 'foo' },
        })
        expect(query).toHaveBeenNthCalledWith(2, QUERY_ORG_CHILDREN_FROM_UI, {
            variables: { id: 'foo' },
        })
        expect(query).toHaveBeenNthCalledWith(3, QUERY_ORG_UNIT_FROM_UI, {
            variables: { id: 'bar' },
        })
    })
})
