// import { history } from './history.js'
// import { pushStateToHistory } from './push-state-to-history.js'

jest.mock('./history.js', () => {
    const actualHistoryModule = jest.requireActual('./history.js')

    return {
        history: {
            ...actualHistoryModule.history,
            push: jest.fn(),
        },
    }
})

describe('pushStateToHistory', () => {
    it('@TODO: implement me!', () => {
        console.log(
            '"pushStateToHistory" test disabled until functionality implemented'
        )
    })

    // it('updates broswer history when state and query params differ', () => {
    //     const mock = jest.fn()
    //     history.push.mockImplementation(mock)

    //     pushStateToHistory({
    //         workflow: { id: '123' },
    //         period: { id: '455' },
    //         orgUnit: { path: '789' },
    //     })

    //     expect(mock).toHaveBeenCalledTimes(1)
    //     expect(mock).toHaveBeenCalledWith({
    //         pathname: '/',
    //         search: '?ou=789&pe=455&wf=123',
    //     })
    // })
    //
    // it('updates broswer history when state and query params are equivalent', () => {
    //     const mock = jest.fn()
    //     history.push.mockImplementation(mock)

    //     pushStateToHistory({
    //         workflow: {},
    //         period: {},
    //         orgUnit: {},
    //     })

    //     expect(mock).toHaveBeenCalledTimes(0)
    // })
})
