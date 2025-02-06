import { CustomDataProvider } from '@dhis2/app-runtime'
// import { shallow } from 'enzyme'
import React from 'react'
import { OrganisationUnitTree } from './organisation-unit-tree.jsx'

// There is no official Enzyme React 18 (or 17) adapter and the advice is to move to RTL
// more context here: https://dev.to/wojtekmaj/enzyme-is-dead-now-what-ekl
// ToDO: migrate this test to RTL and get rid of enzyme
describe.skip('OrganisationUnitTree', () => {
    const origError = console.error.bind(console)
    const errorMock = jest.fn()

    beforeEach(() => {
        console.error = errorMock
    })

    afterEach(() => {
        console.error = origError
        errorMock.mockClear()
    })

    describe('Controlled expanded props', () => {
        describe('Missing props', () => {
            it('should throw a prop-types error when "handleCollapse" is missing', () => {
                shallow(
                    <CustomDataProvider data={{}}>
                        <OrganisationUnitTree
                            roots="/A001"
                            expanded={[]}
                            onChange={() => {}}
                            handleExpand={() => {}}
                        />
                    </CustomDataProvider>
                )

                expect(errorMock).toHaveBeenCalledTimes(1)
                expect(errorMock.mock.calls[0][0]).toMatch(
                    /^Warning: Failed prop type: Invalid prop `handleCollapse` supplied to `OrganisationUnitTree`/
                )
            })

            it('should throw a prop-types error when "handleExpand" is missing', () => {
                shallow(
                    <CustomDataProvider data={{}}>
                        <OrganisationUnitTree
                            roots="/A001"
                            expanded={[]}
                            onChange={() => {}}
                            handleCollapse={() => {}}
                        />
                    </CustomDataProvider>
                )

                expect(errorMock).toHaveBeenCalledTimes(1)
                expect(errorMock.mock.calls[0][0]).toMatch(
                    /^Warning: Failed prop type: Invalid prop `handleExpand` supplied to `OrganisationUnitTree`/
                )
            })

            it('should throw a prop-types error when "expanded" is missing', () => {
                shallow(
                    <CustomDataProvider data={{}}>
                        <OrganisationUnitTree
                            roots="/A001"
                            onChange={() => {}}
                            handleCollapse={() => {}}
                            handleExpand={() => {}}
                        />
                    </CustomDataProvider>
                )

                expect(errorMock).toHaveBeenCalledTimes(1)
                expect(errorMock.mock.calls[0][0]).toMatch(
                    /^Warning: Failed prop type: Invalid prop `expanded` supplied to `OrganisationUnitTree`/
                )
            })
        })
    })
})
