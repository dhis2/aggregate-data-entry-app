import { useQueryClient } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { Wrapper } from '../../test-utils/index.js'
import useImperativeValidate from './use-imperative-validate.js'

jest.mock('@tanstack/react-query', () => {
    const originalModule = jest.requireActual('@tanstack/react-query')

    return {
        ...originalModule,
        useQueryClient: jest.fn(),
    }
})

jest.mock('../use-api-attribute-params.js', () => ({
    useApiAttributeParams: jest.fn(() => ({
        attributeCombo: 'attribute-combo-id',
        attributeOptions: ['attribute-option-id-1', 'attribute-option-id-2'],
    })),
}))

jest.mock('../use-context-selection/use-context-selection.js', () => ({
    useContextSelection: jest.fn(() => [
        {
            dataSetId: 'data-set-id',
            orgUnitId: 'org-unig-id',
            periodId: 'period-id',
        },
    ]),
}))

describe('useImperativeValidate', () => {
    it('should return a function that returns a validation result with errors', async () => {
        useQueryClient.mockImplementation(() => ({
            fetchQuery: jest.fn(([resource]) => {
                if (resource === 'validation/dataSet/data-set-id') {
                    return {
                        commentRequiredViolations: {},
                        validationRuleViolations: [
                            {
                                id: 0,
                                validationRule: {
                                    name: 'PCV 2 <= PCV 1',
                                    created: '2014-07-16T12:56:42.441',
                                    lastUpdated: '2014-07-16T17:23:51.253',
                                    displayName: 'PCV 2 <= PCV 1',
                                    id: 'sxamEpoUXb5',
                                },
                                period: { id: '202303' },
                                organisationUnit: { id: 'ImspTQPwCqd' },
                                attributeOptionCombo: { id: 'HllvX50cXC0' },
                                leftsideValue: 10.0,
                                rightsideValue: 2.0,
                                dayInPeriod: 31,
                                notificationSent: false,
                            },
                        ],
                    }
                }

                if (resource === 'validationRules') {
                    return {
                        validationRules: [
                            {
                                id: 'sxamEpoUXb5',
                                importance: 'MEDIUM',
                                operator: 'less_than_or_equal_to',
                                leftSide: {
                                    translations: [],
                                    expression: '#{GCGfEY82Wz6.Prlt0C1RF0s}',
                                    description:
                                        'At Measles, slept under LLITN last night, <1 year Fixed',
                                    slidingWindow: false,
                                    missingValueStrategy:
                                        'SKIP_IF_ANY_VALUE_MISSING',
                                    displayDescription:
                                        'At Measles, slept under LLITN last night, <1 year Fixed',
                                },
                                rightSide: {
                                    translations: [],
                                    expression: '#{YtbsuPPo010.Prlt0C1RF0s}',
                                    description:
                                        'Measles, <1 year Fixed[34.292]',
                                    slidingWindow: false,
                                    missingValueStrategy:
                                        'SKIP_IF_ANY_VALUE_MISSING',
                                    displayDescription:
                                        'Measles, <1 year Fixed[34.292]',
                                },
                                displayInstruction:
                                    'Slept under LLIN at measles (fixed < 1y) cannot be higher than measles doses given (fixed < 1y)',
                                displayDescription: 'Question asked at Measles',
                                displayName:
                                    'Measles, Slept under LLITN last night, <1 year Fixed',
                            },
                        ],
                    }
                }

                throw new Error('Should never get here')
            }),
        }))

        const { result } = renderHook(useImperativeValidate, {
            wrapper: ({ children }) => (
                <Wrapper dataForCustomProvider={{}}>{children}</Wrapper>
            ),
        })

        const validationResult = await result.current()

        expect(validationResult).toEqual({
            validationRuleViolations: {
                MEDIUM: [
                    {
                        id: 0,
                        validationRule: {
                            name: 'PCV 2 <= PCV 1',
                            created: '2014-07-16T12:56:42.441',
                            lastUpdated: '2014-07-16T17:23:51.253',
                            displayName: 'PCV 2 <= PCV 1',
                            id: 'sxamEpoUXb5',
                        },
                        period: { id: '202303' },
                        organisationUnit: { id: 'ImspTQPwCqd' },
                        attributeOptionCombo: { id: 'HllvX50cXC0' },
                        leftsideValue: 10,
                        rightsideValue: 2,
                        dayInPeriod: 31,
                        notificationSent: false,
                        metaData: {
                            id: 'sxamEpoUXb5',
                            importance: 'MEDIUM',
                            operator: 'less_than_or_equal_to',
                            leftSide: {
                                translations: [],
                                expression: '#{GCGfEY82Wz6.Prlt0C1RF0s}',
                                description:
                                    'At Measles, slept under LLITN last night, <1 year Fixed',
                                slidingWindow: false,
                                missingValueStrategy:
                                    'SKIP_IF_ANY_VALUE_MISSING',
                                displayDescription:
                                    'At Measles, slept under LLITN last night, <1 year Fixed',
                            },
                            rightSide: {
                                translations: [],
                                expression: '#{YtbsuPPo010.Prlt0C1RF0s}',
                                description: 'Measles, <1 year Fixed[34.292]',
                                slidingWindow: false,
                                missingValueStrategy:
                                    'SKIP_IF_ANY_VALUE_MISSING',
                                displayDescription:
                                    'Measles, <1 year Fixed[34.292]',
                            },
                            displayInstruction:
                                'Slept under LLIN at measles (fixed < 1y) cannot be higher than measles doses given (fixed < 1y)',
                            displayDescription: 'Question asked at Measles',
                            displayName:
                                'Measles, Slept under LLITN last night, <1 year Fixed',
                        },
                    },
                ],
            },
            commentRequiredViolations: {},
        })
    })

    it('should return a function that rejects when a request fails', () => {
        useQueryClient.mockImplementation(() => ({
            fetchQuery: jest.fn(([resource]) => {
                if (resource === 'validation/dataSet/data-set-id') {
                    return Promise.resolve({
                        commentRequiredViolations: {},
                        validationRuleViolations: [],
                    })
                }

                if (resource === 'validationRules') {
                    return Promise.reject('An error occurred')
                }

                throw new Error('Should never get here')
            }),
        }))

        const { result } = renderHook(useImperativeValidate, {
            wrapper: ({ children }) => (
                <Wrapper dataForCustomProvider={{}}>{children}</Wrapper>
            ),
        })

        expect(result.current()).rejects.toEqual('An error occurred')
    })
})
