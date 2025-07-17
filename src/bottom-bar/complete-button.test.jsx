import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useMetadata } from '../shared/metadata/use-metadata.js'
import { useDataSetId } from '../shared/use-context-selection/use-context-selection.js'
import { useDataValueSet } from '../shared/use-data-value-set/use-data-value-set.js'
import { useImperativeValidate } from '../shared/validation/use-imperative-validate.js'
import { render } from '../test-utils/render.jsx'
import CompleteButton from './complete-button.jsx'

const mockShow = jest.fn()
const mockSetFormCompletion = jest
    .fn()
    .mockImplementation(() => Promise.resolve())
const mockValidate = jest.fn().mockImplementation(() =>
    Promise.resolve({
        commentRequiredViolations: [],
        validationRuleViolations: [],
    })
)
const mockSetCompleteAttempted = jest.fn()
const mockIsComplete = jest.fn()

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useAlert: jest.fn(() => ({
        show: mockShow,
    })),
}))

jest.mock('../shared/use-context-selection/use-context-selection.js', () => ({
    ...jest.requireActual(
        '../shared/use-context-selection/use-context-selection.js'
    ),
    useDataSetId: jest.fn(),
}))

jest.mock('../shared/metadata/use-metadata.js', () => ({
    useMetadata: jest.fn(),
}))

jest.mock('../shared/validation/use-imperative-validate.js', () => ({
    useImperativeValidate: jest.fn(),
}))

jest.mock('../shared/completion/use-set-form-completion-mutation.js', () => ({
    ...jest.requireActual(
        '../shared/completion/use-set-form-completion-mutation.js'
    ),
    useSetFormCompletionMutation: jest.fn(() => ({
        mutateAsync: mockSetFormCompletion,
    })),
}))

jest.mock('../shared/stores/entry-form-store.js', () => ({
    ...jest.requireActual('../shared/stores/entry-form-store.js'),
    useEntryFormStore: jest.fn().mockImplementation((func) => {
        const state = {
            setCompleteAttempted: mockSetCompleteAttempted,
        }
        return func(state)
    }),
}))

jest.mock('../shared/stores/data-value-store.js', () => ({
    ...jest.requireActual('../shared/stores/data-value-store.js'),
    useValueStore: jest.fn().mockImplementation((func) => {
        const state = {
            isComplete: mockIsComplete,
        }
        return func(state)
    }),
}))

jest.mock('../shared/use-data-value-set/use-data-value-set.js', () => ({
    useDataValueSet: jest.fn(),
}))

const MOCK_METADATA = {
    dataSets: {
        data_set_id_1: {
            id: 'data_set_id_1',
        },
        data_set_id_compulsory_validation_without_cdeo: {
            id: 'data_set_id_compulsory_validation_without_cdeo',
            compulsoryDataElementOperands: [],
            compulsoryFieldsCompleteOnly: true,
        },
        data_set_id_compulsory_validation_with_cdeo: {
            id: 'data_set_id_compulsory_validation_without_cdeo',
            compulsoryDataElementOperands: [
                {
                    dataElement: {
                        id: 'de-id-1',
                    },
                    categoryOptionCombo: {
                        id: 'coc-id-1',
                    },
                },
                {
                    dataElement: {
                        id: 'de-id-2',
                    },
                    categoryOptionCombo: {
                        id: 'coc-id-2',
                    },
                },
            ],
            compulsoryFieldsCompleteOnly: true,
        },
    },
}

const MOCK_DATA = {
    dataValues: {
        'de-id-1': {
            'coc-id-1': {
                value: '5',
            },
        },
        'de-id-2': {
            'coc-id-2': {
                value: '10',
            },
        },
    },
}

const MOCK_DATA_INCOMPLETE = {
    dataValues: {
        'de-id-1': {
            'coc-id-1': {
                value: '5',
            },
        },
    },
}

describe('CompleteButton', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        useImperativeValidate.mockReturnValue(mockValidate)
    })

    it('validates form and completes when clicked', async () => {
        mockIsComplete.mockReturnValue(false)
        useDataSetId.mockReturnValue(['data_set_id_1'])
        useDataValueSet.mockReturnValue({ data: MOCK_DATA })
        useMetadata.mockReturnValue({ data: MOCK_METADATA })
        const { getByText } = render(<CompleteButton />)

        await userEvent.click(getByText('Mark complete'))
        expect(mockValidate).toHaveBeenCalledOnce()
        expect(mockSetFormCompletion).toHaveBeenCalledWith({ completed: true })
    })

    it('completes if the compulsoryFieldsCompleteOnly:true but there are no compulsory data element operands', async () => {
        mockIsComplete.mockReturnValue(false)
        useDataSetId.mockReturnValue([
            'data_set_id_compulsory_validation_without_cdeo',
        ])
        useDataValueSet.mockReturnValue({ data: MOCK_DATA })
        useMetadata.mockReturnValue({ data: MOCK_METADATA })
        const { getByText } = render(<CompleteButton />)

        await userEvent.click(getByText('Mark complete'))
        expect(mockValidate).toHaveBeenCalledOnce()
        expect(mockSetFormCompletion).toHaveBeenCalledWith({ completed: true })
        // completeAttempted only set if the complete is rejected due to compulsory data element operands
        expect(mockSetCompleteAttempted).not.toHaveBeenCalled()
    })

    it('does not complete and shows error if the compulsoryFieldsCompleteOnly:true and there are compulsory data element operands without values', async () => {
        mockIsComplete.mockReturnValue(false)
        useDataSetId.mockReturnValue([
            'data_set_id_compulsory_validation_with_cdeo',
        ])
        useDataValueSet.mockReturnValue({ data: MOCK_DATA_INCOMPLETE })
        useMetadata.mockReturnValue({ data: MOCK_METADATA })
        const { getByText } = render(<CompleteButton />)

        await userEvent.click(getByText('Mark complete'))
        expect(mockValidate).not.toHaveBeenCalled()
        expect(mockSetFormCompletion).not.toHaveBeenCalled()
        expect(mockSetCompleteAttempted).toHaveBeenCalledWith(true)
        await waitFor(() =>
            expect(mockShow).toHaveBeenCalledWith(
                'Compulsory fields must be filled out before completing the form'
            )
        )
    })

    it('completes if the compulsoryFieldsCompleteOnly:true and there are compulsory data element operands but all have values', async () => {
        mockIsComplete.mockReturnValue(false)
        useDataSetId.mockReturnValue([
            'data_set_id_compulsory_validation_with_cdeo',
        ])
        useDataValueSet.mockReturnValue({ data: MOCK_DATA })
        useMetadata.mockReturnValue({ data: MOCK_METADATA })
        const { getByText } = render(<CompleteButton />)

        await userEvent.click(getByText('Mark complete'))
        expect(mockValidate).toHaveBeenCalledOnce()
        expect(mockSetFormCompletion).toHaveBeenCalledWith({ completed: true })
        // completeAttempted only set if the complete is rejected due to compulsory data element operands
        expect(mockSetCompleteAttempted).not.toHaveBeenCalled()
    })

    it('marks form as incomplete if form is completed', async () => {
        mockIsComplete.mockReturnValue(true)
        useDataSetId.mockReturnValue(['data_set_id_1'])
        useDataValueSet.mockReturnValue({ data: MOCK_DATA })
        useMetadata.mockReturnValue({ data: MOCK_METADATA })
        const { getByText } = render(<CompleteButton />)

        await userEvent.click(getByText('Mark incomplete'))
        expect(mockValidate).not.toHaveBeenCalledOnce()
        expect(mockSetFormCompletion).toHaveBeenCalledWith({ completed: false })
    })
})
