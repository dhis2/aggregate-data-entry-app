import { IconInfo16 } from '@dhis2/ui'
import { fireEvent } from '@testing-library/react'
import React from 'react'
import { render } from '../../test-utils/index.js'
import { FinalFormWrapper } from '../final-form-wrapper.js'
import { IndicatorTableCell } from './indicator-table-cell.js'
import { useIndicatorValue } from './use-indicator-value.js'

jest.mock('@dhis2/ui', () => ({
    ...jest.requireActual('@dhis2/ui'),
    IconInfo16: jest.fn(),
}))
jest.mock('./use-indicator-value', () => ({
    ...jest.requireActual('./use-indicator-value'),
    useIndicatorValue: jest.fn(),
}))

const MOCK_INDICATOR_INFO = {
    decimals: 2,
    factor: 1,
    numerator: '#{fakeUID1}',
    denominator: '#{fakeUID2}',
}

describe('IndicatorTableCell', () => {
    it('shows the value returned by useIndicatorValue if valid', async () => {
        useIndicatorValue.mockReturnValue('42')
        const { findByText } = render(
            <IndicatorTableCell {...MOCK_INDICATOR_INFO} />,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )
        expect(await findByText('42')).toBeInTheDocument()
    })

    it('shows icon and tooltip for invalid values', async () => {
        IconInfo16.mockReturnValue(<p>INFO_ICON</p>)
        useIndicatorValue.mockReturnValue('noncalculable_value')
        const { findByText, getByTestId } = render(
            <IndicatorTableCell {...MOCK_INDICATOR_INFO} />,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const indicatorCell = await getByTestId('dhis2-uicore-tablecell')

        // check for warning text for tooltip on hover
        fireEvent.mouseEnter(indicatorCell.firstChild)
        expect(
            await findByText('This value cannot be calculated in this app')
        ).toBeInTheDocument()

        // check that the mocked value of info icon is present
        expect(await findByText('INFO_ICON')).toBeInTheDocument()
    })
})
