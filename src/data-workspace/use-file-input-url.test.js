import { useConfig } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react-hooks'
import useFileInputUrl from './use-file-input-url.js'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: jest.fn(),
}))

describe('useFileInput hook', () => {
    it('should return the file download Url', () => {
        useConfig.mockImplementation(() => ({ baseUrl: 'http://local:8030' }))
        const { result } = renderHook(() =>
            useFileInputUrl({ pe: '2022Q1', ou: 'ImspTQPwCqd' })
        )
        expect(result.current).toEqual(
            'http://local:8030/api/dataValues/files?pe=2022Q1&ou=ImspTQPwCqd'
        )
    })
})
