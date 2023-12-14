import { VALUE_TYPES, CAN_HAVE_LIMITS_TYPES } from '../../shared/index.js'
import {
    validateByValueType,
    warningValidateByValueType,
} from './validators.js'

describe(`validateByValueTypeWithLimits`, () => {
    describe(`when limits are defined`, () => {
        it.each([
            ...CAN_HAVE_LIMITS_TYPES.filter(
                (valueType) => valueType !== VALUE_TYPES.INTEGER_NEGATIVE
            ).map((valueType) => [
                {
                    valueType,
                    value: 4,
                    min: 5,
                    max: 10,
                },
            ]),
            [
                {
                    valueType: VALUE_TYPES.INTEGER_NEGATIVE,
                    value: -4,
                    min: -10,
                    max: -5,
                },
            ],
        ])(
            'should not return error for %s type that supports limits where value is outside of bounds',
            ({ valueType, value, min, max }) => {
                // limits are handled as warnings - not errors!
                const errorMessage = validateByValueType(valueType, {
                    min,
                    max,
                })(value)
                expect(errorMessage).toEqual(undefined)
            }
        )

        it('should not return error for type that support limits and is in bounds', () => {
            expect(
                validateByValueType(VALUE_TYPES.NUMBER, {
                    min: 5,
                    max: 10,
                })(7)
            ).toBeUndefined()
        })

        it('should not return error for type that does not support limits', () => {
            expect(
                validateByValueType(VALUE_TYPES.TEXT, {
                    min: 5,
                    max: 10,
                })(`asdf`)
            ).toBeUndefined()
        })
    })

    describe(`when limits are undefined`, () => {
        it('should not return error', () => {
            expect(
                validateByValueType(VALUE_TYPES.INTEGER, undefined)(4)
            ).toBeUndefined()
        })

        it('should not return error for type that support limits and only has min defined', () => {
            expect(
                validateByValueType(VALUE_TYPES.NUMBER, {
                    min: 5,
                })(7)
            ).toBeUndefined()
        })

        it('should not return error for type that support limits and only has min defined', () => {
            expect(
                validateByValueType(VALUE_TYPES.NUMBER, {
                    max: 10,
                })(7)
            ).toBeUndefined()
        })

        it('should return error when valueType is number and value is not a number', () => {
            expect(validateByValueType(VALUE_TYPES.NUMBER, {})('asdf')).toEqual(
                'Please provide a number'
            )
        })

        it('should return error when not a valid percentage', () => {
            expect(
                validateByValueType(VALUE_TYPES.PERCENTAGE, {})(101)
            ).toEqual('Number cannot be less than 0 or more than 100')
        })
    })
})

describe('warningValidateByValueType', () => {
    describe(`when limits are defined`, () => {
        it.each([
            ...CAN_HAVE_LIMITS_TYPES.filter(
                (valueType) => valueType !== VALUE_TYPES.INTEGER_NEGATIVE
            ).map((valueType) => [
                {
                    valueType,
                    value: 4,
                    min: 5,
                    max: 10,
                    expectedErrorMessage:
                        'Number cannot be less than 5 or more than 10',
                },
            ]),
            [
                {
                    valueType: VALUE_TYPES.INTEGER_NEGATIVE,
                    value: -4,
                    min: -10,
                    max: -5,
                    expectedErrorMessage:
                        'Number cannot be less than -10 or more than -5',
                },
            ],
        ])(
            'should return error for %s type that supports limits where value is outside of bounds',
            ({ valueType, value, min, max, expectedErrorMessage }) => {
                const errorMessage = warningValidateByValueType(valueType, {
                    min,
                    max,
                })(value)
                expect(errorMessage).toEqual(expectedErrorMessage)
            }
        )

        it('should not return error for type that support limits and is in bounds', () => {
            expect(
                warningValidateByValueType(VALUE_TYPES.NUMBER, {
                    min: 5,
                    max: 10,
                })(7)
            ).toBeUndefined()
        })

        it('should not return error for type that does not support limits', () => {
            expect(
                warningValidateByValueType(VALUE_TYPES.TEXT, {
                    min: 5,
                    max: 10,
                })(`asdf`)
            ).toBeUndefined()
        })
    })

    describe(`when limits are undefined`, () => {
        it('should not return error', () => {
            expect(
                warningValidateByValueType(VALUE_TYPES.INTEGER, undefined)(4)
            ).toBeUndefined()
        })

        it('should not return error for type that support limits and only has min defined', () => {
            expect(
                warningValidateByValueType(VALUE_TYPES.NUMBER, {
                    min: 5,
                })(7)
            ).toBeUndefined()
        })

        it('should not return error for type that support limits and only has max defined', () => {
            expect(
                warningValidateByValueType(VALUE_TYPES.NUMBER, {
                    max: 10,
                })(7)
            ).toBeUndefined()
        })
    })
})
