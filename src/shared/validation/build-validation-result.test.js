import buildValidationResult from './build-validation-result.js'

describe('buildValidationResult', () => {
    it('should build a result with no violations', () => {
        const validationRuleViolations = {
            validationRuleViolations: [],
            commentRequiredViolations: [],
        }

        const validationRulesMetaData = {}

        const expected = {
            validationRuleViolations: {},
            commentRequiredViolations: [],
        }

        const actual = buildValidationResult(
            validationRuleViolations,
            validationRulesMetaData
        )

        expect(actual).toEqual(expected)
    })

    it('should contain some commentRequiredViolations', () => {
        const commentRequiredViolations = [
            {
                displayShortName: 'violation 1',
                id: 'comment-required-violation-1',
            },
            {
                displayShortName: 'violation 2',
                id: 'comment-required-violation-2',
            },
        ]

        const validationRuleViolations = {
            validationRuleViolations: [],
            commentRequiredViolations,
        }

        const validationRulesMetaData = {}

        const expected = {
            validationRuleViolations: {},
            commentRequiredViolations: [
                {
                    displayShortName: 'violation 1',
                    id: 'comment-required-violation-1',
                },
                {
                    displayShortName: 'violation 2',
                    id: 'comment-required-violation-2',
                },
            ],
        }

        const actual = buildValidationResult(
            validationRuleViolations,
            validationRulesMetaData
        )

        expect(actual).toEqual(expected)
    })

    it('should group violation by priority', () => {
        const validationRuleViolations = {
            validationRuleViolations: [
                {
                    id: 'violation 1',
                    name: 'Violation 1',
                    validationRule: { id: 'validation-rule-1' },
                },
                {
                    id: 'violation 2',
                    name: 'Violation 2',
                    validationRule: { id: 'validation-rule-2' },
                },
            ],
            commentRequiredViolations: [],
        }

        const validationRulesMetaData = {
            validationRules: [
                {
                    id: 'validation-rule-1',
                    importance: 'LOW',
                    leftSide: { displayDescription: 'Inspection 1st year' },
                    rightSide: { displayDescription: 'Inspection 2nd year' },
                    operator: '>=',
                    displayDescription:
                        'More or equal amount of inspections in first year than in second year',
                    displayInstruction: '@TODO',
                    displayName: 'Inspection 1st year >= inspection 2nd year',
                },
                {
                    id: 'validation-rule-2',
                    importance: 'HIGH',
                    leftSide: { displayDescription: 'Inspection 2nd year' },
                    rightSide: { displayDescription: 'Inspection 3rd year' },
                    operator: '>=',
                    displayDescription:
                        'More or equal amount of inspections in second year than in third year',
                    displayInstruction: '@TODO',
                    displayName: 'Inspection 2nd year >= inspection 3rd year',
                },
            ],
        }

        const expected = {
            validationRuleViolations: {
                LOW: [
                    {
                        id: 'violation 1',
                        name: 'Violation 1',
                        validationRule: { id: 'validation-rule-1' },
                        metaData: {
                            id: 'validation-rule-1',
                            importance: 'LOW',
                            leftSide: {
                                displayDescription: 'Inspection 1st year',
                            },
                            rightSide: {
                                displayDescription: 'Inspection 2nd year',
                            },
                            operator: '>=',
                            displayDescription:
                                'More or equal amount of inspections in first year than in second year',
                            displayInstruction: '@TODO',
                            displayName:
                                'Inspection 1st year >= inspection 2nd year',
                        },
                    },
                ],
                HIGH: [
                    {
                        id: 'violation 2',
                        name: 'Violation 2',
                        validationRule: { id: 'validation-rule-2' },
                        metaData: {
                            id: 'validation-rule-2',
                            importance: 'HIGH',
                            leftSide: {
                                displayDescription: 'Inspection 2nd year',
                            },
                            rightSide: {
                                displayDescription: 'Inspection 3rd year',
                            },
                            operator: '>=',
                            displayDescription:
                                'More or equal amount of inspections in second year than in third year',
                            displayInstruction: '@TODO',
                            displayName:
                                'Inspection 2nd year >= inspection 3rd year',
                        },
                    },
                ],
            },
            commentRequiredViolations: [],
        }

        const actual = buildValidationResult(
            validationRuleViolations,
            validationRulesMetaData
        )

        expect(actual).toEqual(expected)
    })
})
