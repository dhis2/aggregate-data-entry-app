import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { useDataSetId } from '../use-context-selection/index.js'
import DataSetSelectorBarItem from './data-set-selector-bar-item.js'
import useDataSet from './use-data-set.js'
import useSelectableDataSets from './use-selectable-data-sets.js'

jest.mock('../use-context-selection/index.js', () => ({
    useDataSetId: jest.fn(),
}))

jest.mock('./use-data-set.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('./use-selectable-data-sets.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('<DataSetSelectorBarItem />', () => {
    const setDataSetId = jest.fn()

    // Can't be overwritten with "mockImplementationOnce" as components
    // will rerender in some tests. Instead of manually setting them back
    // to this behavior, this jest hook will set the correct default
    // behavior of the react hooks
    beforeEach(() => {
        useDataSetId.mockImplementation(() => ['', setDataSetId])
        useDataSet.mockImplementation(() => ({
            called: false,
            loading: false,
            error: undefined,
            data: undefined,
        }))
        useSelectableDataSets.mockImplementation(() => ({
            called: false,
            loading: false,
            error: undefined,
            data: undefined,
        }))
    })

    afterEach(() => {
        useDataSetId.mockClear()
        useDataSet.mockClear()
        useSelectableDataSets.mockClear()
    })

    it('should have a label with the text "Data set"', () => {
        const { queryByText } = render(<DataSetSelectorBarItem />)
        expect(queryByText('Data set')).toBeInTheDocument()
    })

    it('should not display that the data sets are being loaded when the network request has not been yet made', () => {
        const { queryByText } = render(<DataSetSelectorBarItem />)
        expect(queryByText('Fetching data set info')).not.toBeInTheDocument()
    })

    // @TODO: What to display here??
    it.skip('should display that the data sets are being loaded', () => {
        useDataSetId.mockImplementationOnce(() => ['data-set-id', jest.fn()])
        useDataSet.mockImplementationOnce(() => ({
            called: true,
            loading: true,
            error: undefined,
            data: undefined,
        }))

        render(<DataSetSelectorBarItem />)
    })

    // @TODO: What to display here??
    it.skip('should display that an error occurred while loading the data sets', () => {
        const error = new Error('Custom error')

        useDataSetId.mockImplementationOnce(() => ['data-set-id', jest.fn()])
        useDataSet.mockImplementationOnce(() => ({
            error,
            called: true,
            loading: false,
            data: undefined,
        }))

        render(<DataSetSelectorBarItem />)
    })

    it("should display the data set's name", () => {
        useDataSetId.mockImplementationOnce(() => ['data-set-id', jest.fn()])
        useDataSet.mockImplementationOnce(() => ({
            data: { displayName: 'data set name' },
            called: true,
            loading: false,
            error: undefined,
        }))

        const { queryByText } = render(<DataSetSelectorBarItem />)
        expect(queryByText('data set name')).toBeInTheDocument()
    })

    it('should open the menu', async () => {
        const { queryByText, findByTestId } = render(<DataSetSelectorBarItem />)
        const button = queryByText('Data set')
        fireEvent.click(button)

        const menuList = await findByTestId('dhis2-uicore-popper')
        expect(menuList).toBeInTheDocument()
    })

    it('should display the loading data sets message when not loading initially', async () => {
        useSelectableDataSets.mockImplementationOnce(() => ({
            called: false,
            loading: false,
            error: undefined,
            data: undefined,
        }))

        const { queryByText, findByText } = render(<DataSetSelectorBarItem />)
        const button = queryByText('Data set')
        fireEvent.click(button)

        const loadingMessage = await findByText('Fetching data sets')
        expect(loadingMessage).toBeInTheDocument()
    })

    it('should display the loading data sets message when loading', async () => {
        useSelectableDataSets.mockImplementationOnce(() => ({
            called: true,
            loading: true,
            error: undefined,
            data: undefined,
        }))

        const { queryByText, findByText } = render(<DataSetSelectorBarItem />)
        const button = queryByText('Data set')
        fireEvent.click(button)

        const loadingMessage = await findByText('Fetching data sets')
        expect(loadingMessage).toBeInTheDocument()
    })

    it('should display an error message when an error occurred', async () => {
        useSelectableDataSets.mockImplementation(() => ({
            called: true,
            loading: false,
            error: new Error('Error message'),
            data: undefined,
        }))

        const { queryByText, findByText } = render(<DataSetSelectorBarItem />)
        const button = queryByText('Data set')
        fireEvent.click(button)

        const errorMessage = await findByText(
            'Error occurred while loading data sets'
        )
        expect(errorMessage).toBeInTheDocument()
    })

    it('should display a no-data-sets message when the response is empty', async () => {
        useSelectableDataSets.mockImplementation(() => ({
            called: true,
            loading: false,
            error: undefined,
            data: [],
        }))

        const { queryByText, findByText } = render(<DataSetSelectorBarItem />)
        const button = queryByText('Data set')
        fireEvent.click(button)

        const errorMessage = await findByText(
            'There are no data sets available!'
        )
        expect(errorMessage).toBeInTheDocument()
    })
})
