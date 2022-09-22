import { VALUE_TYPES, CAN_HAVE_LIMITS_TYPES } from '../../shared/index.js'
import { validateByValueTypeWithLimits } from './validators.js'

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
                const errorMessage = validateByValueTypeWithLimits(valueType, {
                    min,
                    max,
                })(value)
                expect(errorMessage).toEqual(expectedErrorMessage)
            }
        )

        it('should not return error for type that support limits and is in bounds', () => {
            expect(
                validateByValueTypeWithLimits(VALUE_TYPES.NUMBER, {
                    min: 5,
                    max: 10,
                })(7)
            ).toBeUndefined()
        })

        it('should not return error for type that does not support limits', () => {
            expect(
                validateByValueTypeWithLimits(VALUE_TYPES.TEXT, {
                    min: 5,
                    max: 10,
                })(`asdf`)
            ).toBeUndefined()
        })
    })

    describe(`when limits are undefined`, () => {
        it('should not return error', () => {
            expect(
                validateByValueTypeWithLimits(VALUE_TYPES.INTEGER, undefined)(4)
            ).toBeUndefined()
        })

        it('should not return error for type that support limits and only has min defined', () => {
            expect(
                validateByValueTypeWithLimits(VALUE_TYPES.NUMBER, {
                    min: 5,
                })(7)
            ).toBeUndefined()
        })

        it('should not return error for type that support limits and only has min defined', () => {
            expect(
                validateByValueTypeWithLimits(VALUE_TYPES.NUMBER, {
                    max: 10,
                })(7)
            ).toBeUndefined()
        })
    })
})
