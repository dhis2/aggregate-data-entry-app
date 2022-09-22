import createQueryFn from './create-query-fn.js'

describe('createQueryFn', () => {
    it('calls engine.query with the correct query format for app-runtime', async () => {
        const engineSpy = {
            query: jest.fn(() => Promise.resolve({})),
        }
        const queryFn = createQueryFn(engineSpy)
        const queryKey = ['resource']

        await queryFn({ queryKey })
        expect(engineSpy.query).toHaveBeenCalledWith({
            resource: { resource: 'resource' },
        })
    })

    it('includes the id if it is present in the querykey', async () => {
        const engineSpy = {
            query: jest.fn(() => Promise.resolve({})),
        }
        const queryFn = createQueryFn(engineSpy)
        const queryKey = ['resource', { id: 'id' }]

        await queryFn({ queryKey })
        expect(engineSpy.query).toHaveBeenCalledWith({
            resource: { resource: 'resource', id: 'id' },
        })
    })

    it('includes params if they are present in the querykey', async () => {
        const engineSpy = {
            query: jest.fn(() => Promise.resolve({})),
        }
        const queryFn = createQueryFn(engineSpy)
        const queryKey = ['resource', { params: 'params' }]

        await queryFn({ queryKey })
        expect(engineSpy.query).toHaveBeenCalledWith({
            resource: { resource: 'resource', params: 'params' },
        })
    })

    it('returns the data without nesting', async () => {
        const expected = 'expected'
        const engineSpy = {
            query: jest.fn(() => Promise.resolve({ resource: expected })),
        }
        const queryFn = createQueryFn(engineSpy)
        const queryKey = ['resource']

        const actual = await queryFn({ queryKey })
        expect(actual).toBe(expected)
    })
})
