import { useQueryClient } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Wrapper } from '../../test-utils/index.js'
import {
    getValidationMetaDataQueryKey,
    getValidationQueryKey,
} from './query-key-factory.js'
import useImperativeValidate from './use-imperative-validate.js'

jest.mock('@tanstack/react-query', () => {
    const originalModule = jest.requireActual('@tanstack/react-query')

    return {
        ...originalModule,
        useQueryClient: jest.fn(),
    }
})

jest.mock('./query-key-factory.js', () => ({
    getValidationMetaDataQueryKey: jest.fn(),
    getValidationQueryKey: jest.fn(),
}))

describe('useImperativeValidate', () => {
    getValidationMetaDataQueryKey.mockImplementation(() => 'validationMetaDataQueryKey')
    getValidationQueryKey.mockImplementation(() => 'validationQueryKey')

    it('should return a function that returns a validation result with errors', async () => {
        const fetchQuery = jest.fn((query) => {
            if (query === 'validationQueryKey') {
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
                            notificationSent: false
                        },
                    ],
                }
            }

            if (query === 'validationMetaDataQueryKey') {
                return {
                    validationRules: [
                        {
                            id: 'sxamEpoUXb5',
                            importance: 'MEDIUM',
                            operator: 'less_than_or_equal_to',
                            leftSide: {
                                translations: [],
                                expression: '#{GCGfEY82Wz6.Prlt0C1RF0s}',
                                description: 'At Measles, slept under LLITN last night, <1 year Fixed',
                                slidingWindow: false,
                                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                                displayDescription: 'At Measles, slept under LLITN last night, <1 year Fixed'
                            },
                            rightSide: {
                                translations: [],
                                expression: '#{YtbsuPPo010.Prlt0C1RF0s}',
                                description: 'Measles, <1 year Fixed[34.292]',
                                slidingWindow: false,
                                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                                displayDescription: 'Measles, <1 year Fixed[34.292]'
                            },
                            displayInstruction: 'Slept under LLIN at measles (fixed < 1y) cannot be higher than measles doses given (fixed < 1y)',
                            displayDescription: 'Question asked at Measles',
                            displayName: 'Measles, Slept under LLITN last night, <1 year Fixed',
                        },
                    ],
                }
            }

            throw new Error('Should never get here')
        })

        useQueryClient.mockImplementation(() => ({ fetchQuery }))

        const { result } = renderHook(useImperativeValidate, {
            wrapper: ({ children }) => (
                <Wrapper dataForCustomProvider={{}}>
                    {children}
                </Wrapper>
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
                            id: 'sxamEpoUXb5'
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
                                description: 'At Measles, slept under LLITN last night, <1 year Fixed',
                                slidingWindow: false,
                                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                                displayDescription: 'At Measles, slept under LLITN last night, <1 year Fixed'
                            },
                            rightSide: {
                                translations: [],
                                expression: '#{YtbsuPPo010.Prlt0C1RF0s}',
                                description: 'Measles, <1 year Fixed[34.292]',
                                slidingWindow: false,
                                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                                displayDescription: 'Measles, <1 year Fixed[34.292]'
                            },
                            displayInstruction: 'Slept under LLIN at measles (fixed < 1y) cannot be higher than measles doses given (fixed < 1y)',
                            displayDescription: 'Question asked at Measles',
                            displayName: 'Measles, Slept under LLITN last night, <1 year Fixed'
                        }
                    }
                ]
            },
            commentRequiredViolations: {}
        })
    })
})
