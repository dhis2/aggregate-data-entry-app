import { getAllByTestId, queryAllByTestId } from '@testing-library/react'
import React from 'react'
import { render } from '../../test-utils/index.js'
import { FinalFormWrapper } from '../final-form-wrapper.jsx'
import { IndicatorsTableBody } from './indicators-table-body.jsx'

const tableIndicators = [
    {
        name: 'indieGator',
        displayFormName: "I'm an indicator!",
        decimals: 2,
        indicatorType: {
            factor: 1,
        },
        numerator: '#{fakeUID1}',
        denominator: '#{fakeUID2}',
        id: 'indicator1',
    },
]

describe('<IndicatorsTableBody />', () => {
    it('should not render padding cells if maxColumnsInSection=0', () => {
        const result = render(
            <IndicatorsTableBody
                indicators={tableIndicators}
                maxColumnsInSection={0}
            />,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const inputRows = result.getAllByTestId(
            'dhis2-dataentry-indicatorstablerow'
        )

        const cellsInFirstRow = queryAllByTestId(
            inputRows[0],
            'dhis2-dataentry-indicatorspaddingcell'
        )
        expect(cellsInFirstRow.length).toBe(0)
    })

    it('should not render padding cells if maxColumnsInSection=-Infinity', () => {
        const result = render(
            <IndicatorsTableBody
                indicators={tableIndicators}
                maxColumnsInSection={-Infinity}
            />,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const inputRows = result.getAllByTestId(
            'dhis2-dataentry-indicatorstablerow'
        )
        expect(inputRows.length).toBe(1)

        const cellsInFirstRow = queryAllByTestId(
            inputRows[0],
            'dhis2-dataentry-indicatorspaddingcell'
        )
        expect(cellsInFirstRow.length).toBe(0)
    })

    it('should render 3 padding cells if 1 indicator and maxColumnsInSection=4', () => {
        const result = render(
            <IndicatorsTableBody
                indicators={tableIndicators}
                maxColumnsInSection={4}
            />,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const inputRows = result.getAllByTestId(
            'dhis2-dataentry-indicatorstablerow'
        )

        const cellsInFirstRow = getAllByTestId(
            inputRows[0],
            'dhis2-dataentry-indicatorspaddingcell'
        )
        expect(cellsInFirstRow.length).toBe(3)
    })

    it('should render 4 padding cells if 1 indicator, maxColumnsInSection=4, and row totals displayed', () => {
        const result = render(
            <IndicatorsTableBody
                indicators={tableIndicators}
                maxColumnsInSection={4}
                renderRowTotals={true}
            />,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const inputRows = result.getAllByTestId(
            'dhis2-dataentry-indicatorstablerow'
        )

        const cellsInFirstRow = getAllByTestId(
            inputRows[0],
            'dhis2-dataentry-indicatorspaddingcell'
        )
        expect(cellsInFirstRow.length).toBe(4)
    })
})
