import { IconInfo16, IconWarning16 } from '@dhis2/ui'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useHighlightedFieldStore } from '../../shared/index.js'
import { render } from '../../test-utils/index.js'
import { IndicatorTableCell } from './indicator-table-cell.jsx'
import { useIndicatorValue } from './use-indicator-value.js'

jest.mock('@dhis2/ui', () => ({
    ...jest.requireActual('@dhis2/ui'),
    IconInfo16: jest.fn(),
    IconWarning16: jest.fn(),
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
    indicatorId: 'indicator1',
}

describe('IndicatorTableCell', () => {
    const initialHighlightedFieldState = useHighlightedFieldStore.getState()

    beforeEach(() => {
        useHighlightedFieldStore.setState(initialHighlightedFieldState)
    })

    it('shows the value returned by useIndicatorValue if valid', async () => {
        useIndicatorValue.mockReturnValue({ value: '42' })
        const { findByText } = render(
            <IndicatorTableCell {...MOCK_INDICATOR_INFO} />
        )
        expect(await findByText('42')).toBeInTheDocument()
    })

    it('shows info icon and tooltip for non calculable values', async () => {
        IconInfo16.mockReturnValue(<p>INFO_ICON</p>)
        useIndicatorValue.mockReturnValue({ value: 'noncalculable_value' })
        const { findByText, getByTestId } = render(
            <IndicatorTableCell {...MOCK_INDICATOR_INFO} />
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

    it('shows warning icon and tooltip for mathematically invalid values', async () => {
        IconWarning16.mockReturnValue(<p>WARNING_ICON</p>)
        useIndicatorValue.mockReturnValue({
            value: 'mathematically_invalid_value',
            numeratorValue: '1',
            denominatorValue: '0',
        })
        const { findByText, getByTestId } = render(
            <IndicatorTableCell {...MOCK_INDICATOR_INFO} />
        )

        const indicatorCell = await getByTestId('dhis2-uicore-tablecell')

        // check for warning text for tooltip on hover
        fireEvent.mouseEnter(indicatorCell.firstChild)
        expect(
            await findByText(
                'This expression is not mathematically calculable 1/0'
            )
        ).toBeInTheDocument()

        // check that the mocked value of info icon is present
        expect(await findByText('WARNING_ICON')).toBeInTheDocument()
    })

    it('calls setHighlightedFieldId with the indicatorId of the focused cell', async () => {
        useIndicatorValue.mockReturnValue({ value: '42' })
        const { container, findAllByText } = render(
            <>
                <IndicatorTableCell
                    {...MOCK_INDICATOR_INFO}
                    indicatorId="indicator1"
                />
                <IndicatorTableCell
                    {...MOCK_INDICATOR_INFO}
                    indicatorId="indicator2"
                />
            </>
        )

        await findAllByText('42')
        const [cellA, cellB] = container.querySelectorAll('[tabindex="0"]')

        expect(
            useHighlightedFieldStore.getState().highlightedFieldId
        ).not.toEqual({ indicatorId: 'indicator1' })

        // activate the first cell by clicking it
        await userEvent.click(cellA)
        expect(useHighlightedFieldStore.getState().highlightedFieldId).toEqual({
            indicatorId: 'indicator1',
        })

        // tab into the second cell
        await userEvent.tab()
        expect(document.activeElement).toBe(cellB)
        expect(useHighlightedFieldStore.getState().highlightedFieldId).toEqual({
            indicatorId: 'indicator2',
        })
    })
})
