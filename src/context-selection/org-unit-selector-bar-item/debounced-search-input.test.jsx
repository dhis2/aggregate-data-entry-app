/** @author Morten Svanæs */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import DebouncedSearchInput from './debounced-search-input.jsx'

beforeEach(() => jest.useFakeTimers())
afterEach(() => {
    cleanup()
    jest.useRealTimers()
})

it('invalidates immediately but submits only the final trimmed value after 200 ms', () => {
    const onChange = jest.fn()
    const onInputChange = jest.fn()
    render(
        <DebouncedSearchInput
            initialValue=""
            onChange={onChange}
            onInputChange={onInputChange}
        />
    )
    onChange.mockClear()
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'a' } })
    act(() => jest.advanceTimersByTime(150))
    fireEvent.change(input, { target: { value: '  abc  ' } })
    expect(onInputChange).toHaveBeenLastCalledWith('  abc  ')
    act(() => jest.advanceTimersByTime(199))
    expect(onChange).not.toHaveBeenCalled()
    act(() => jest.advanceTimersByTime(1))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith('abc')

    // Returning to a previously submitted value still has a trailing debounce.
    onChange.mockClear()
    fireEvent.change(input, { target: { value: '' } })
    expect(onInputChange).toHaveBeenLastCalledWith('')
    fireEvent.change(input, { target: { value: '  abc  ' } })
    act(() => jest.advanceTimersByTime(199))
    expect(onChange).not.toHaveBeenCalled()
    act(() => jest.advanceTimersByTime(1))
    expect(onChange).toHaveBeenLastCalledWith('abc')
})

it('waits for IME composition to finish before starting the search debounce', () => {
    const onChange = jest.fn()
    render(
        <DebouncedSearchInput
            initialValue=""
            onChange={onChange}
            onInputChange={jest.fn()}
        />
    )
    onChange.mockClear()
    const input = screen.getByRole('textbox')
    fireEvent.compositionStart(input)
    fireEvent.change(input, { target: { value: '東京病院' } })
    act(() => jest.advanceTimersByTime(500))
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.compositionEnd(input, { data: '東京病院' })
    act(() => jest.advanceTimersByTime(199))
    expect(onChange).not.toHaveBeenCalled()
    act(() => jest.advanceTimersByTime(1))
    expect(onChange).toHaveBeenLastCalledWith('東京病院')
})
