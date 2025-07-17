import React from 'react'
import { render } from '../../../../test-utils/render.jsx'
import { OrganisationUnitTree } from './organisation-unit-tree.jsx'

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
})
