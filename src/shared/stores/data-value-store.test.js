import { act, renderHook } from '@testing-library/react-hooks'
import { initialState, valueStore, useValueStore } from './data-value-store.js'

describe('data value store', () => {
    beforeEach(() => {
        valueStore.setState(initialState)
    })

    it('should set the data value set', async () => {
        const { result, waitFor } = renderHook(useValueStore)
        const dataValueSet = {
            dataValues: 'foo',
            minMaxValues: 'bar',
        }

        act(() => {
            result.current.setDataValueSet(dataValueSet)
        })

        await waitFor(() => {
            const actual = result.current.getDataValues()
            expect(actual).toEqual(dataValueSet.dataValues)
        })
    })

    it('should set the data value set to the initial state when argument is falsy', async () => {
        const { result, waitFor } = renderHook(useValueStore)

        act(() => {
            result.current.setDataValueSet()
        })

        await waitFor(() => {
            expect(result.current).toEqual(
                expect.objectContaining({
                    dataValueSet: {
                        dataValues: {},
                        minMaxValues: [],
                    },
                })
            )
        })
    })

    it('should get a data value by de id and coc id', async () => {
        const dataValueSet = {
            dataValues: {
                'de-id': {
                    'coc-id': 'foobar',
                },
            },
            minMaxValues: [],
        }

        valueStore.setState({ dataValueSet })

        const { result } = renderHook(useValueStore)

        const actual = result.current.getDataValue({
            dataElementId: 'de-id',
            categoryOptionComboId: 'coc-id',
        })

        expect(actual).toEqual('foobar')
    })

    it('should return true when the data value set has been completed', async () => {
        const dataValueSet = {
            completeStatus: { complete: true },
        }

        valueStore.setState({ dataValueSet })
        const { result } = renderHook(useValueStore)

        const actual = result.current.isComplete()
        expect(actual).toBe(true)
    })

    it('should return false when completeStatus object does not exist', async () => {
        const dataValueSet = {}

        valueStore.setState({ dataValueSet })
        const { result } = renderHook(useValueStore)

        const actual = result.current.isComplete()
        expect(actual).toBe(false)
    })

    it('should return false when completeStatus.copmlete property does not exist', async () => {
        const dataValueSet = {
            completeStatus: {},
        }

        valueStore.setState({ dataValueSet })
        const { result } = renderHook(useValueStore)

        const actual = result.current.isComplete()
        expect(actual).toBe(false)
    })

    it('should return false when completeStatus.copmlete is false', async () => {
        const dataValueSet = {
            completeStatus: { complete: false },
        }

        valueStore.setState({ dataValueSet })
        const { result } = renderHook(useValueStore)

        const actual = result.current.isComplete()
        expect(actual).toBe(false)
    })

    it('should return true when a data value has a comment', () => {
        const dataValueSet = {
            dataValues: {
                'de-id': {
                    'coc-id': {
                        comment: 'This is a comment',
                    },
                },
            },
        }

        valueStore.setState({ dataValueSet })
        const { result } = renderHook(useValueStore)

        const actual = result.current.hasComment({
            dataElementId: 'de-id',
            categoryOptionComboId: 'coc-id',
        })

        expect(actual).toBe(true)
    })

    it('should return false when a data value has an empty comment', () => {
        const dataValueSet = {
            dataValues: {
                'de-id': {
                    'coc-id': {
                        comment: '',
                    },
                },
            },
        }

        valueStore.setState({ dataValueSet })
        const { result } = renderHook(useValueStore)

        const actual = result.current.hasComment({
            dataElementId: 'de-id',
            categoryOptionComboId: 'coc-id',
        })

        expect(actual).toBe(false)
    })

    it('should return false when a data value does not have a comment', () => {
        const dataValueSet = {
            dataValues: {
                'de-id': {
                    'coc-id': {},
                },
            },
        }

        valueStore.setState({ dataValueSet })
        const { result } = renderHook(useValueStore)

        const actual = result.current.hasComment({
            dataElementId: 'de-id',
            categoryOptionComboId: 'coc-id',
        })

        expect(actual).toBe(false)
    })

    it('should return false when a data value does not exist', () => {
        const dataValueSet = {
            dataValues: {},
        }

        valueStore.setState({ dataValueSet })
        const { result } = renderHook(useValueStore)

        const actual = result.current.hasComment({
            dataElementId: 'de-id',
            categoryOptionComboId: 'coc-id',
        })

        expect(actual).toBe(false)
    })

    it('should return the min-max limit values', () => {
        const dataValueSet = {
            minMaxValues: [
                {
                    dataElement: 'de-id',
                    categoryOptionCombo: 'coc-id',
                    min: 2,
                    max: 3,
                },
            ],
        }

        valueStore.setState({ dataValueSet })
        const { result } = renderHook(useValueStore)

        const expected = {
            dataElement: 'de-id',
            categoryOptionCombo: 'coc-id',
            min: 2,
            max: 3,
        }
        const actual = result.current.getMinMaxValues({
            dataElementId: 'de-id',
            categoryOptionComboId: 'coc-id',
        })

        expect(actual).toEqual(expected)
    })
})
