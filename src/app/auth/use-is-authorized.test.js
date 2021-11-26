// import { renderHook } from '@testing-library/react-hooks'
// import React from 'react'
// import { AppContext } from '../app-context/index.js'
// import { useIsAuthorized } from './use-is-authorized.js'

describe('useIsAuthorized', () => {
    it('@TODO: implement me!', () => {
        console.log(
            '"useIsAuthorized" test disabled until functionality implemented'
        )
    })

    // it('returns false for unauthorised users', () => {
    //     const value = {
    //         authorities: ['dummy'],
    //     }

    //     const wrapper = ({ children }) => (
    //         <AppContext.Provider value={value}>{children}</AppContext.Provider>
    //     )

    //     const { result } = renderHook(() => useIsAuthorized(), { wrapper })

    //     expect(result.current).toEqual(false)
    // })

    // it('returns true for authorised users', () => {
    //     const value = {
    //         authorities: ['M_dhis-web-approval'],
    //     }

    //     const wrapper = ({ children }) => (
    //         <AppContext.Provider value={value}>{children}</AppContext.Provider>
    //     )

    //     const { result } = renderHook(() => useIsAuthorized(), { wrapper })

    //     expect(result.current).toEqual(true)
    // })

    // it('returns true for superusers', () => {
    //     const value = {
    //         authorities: ['ALL'],
    //     }

    //     const wrapper = ({ children }) => (
    //         <AppContext.Provider value={value}>{children}</AppContext.Provider>
    //     )

    //     const { result } = renderHook(() => useIsAuthorized(), { wrapper })

    //     expect(result.current).toEqual(true)
    // })
})
