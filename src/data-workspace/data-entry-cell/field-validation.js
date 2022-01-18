// imported from ui-forms directly to avoid deprecation
import { number } from '@dhis2/ui-forms'

// todo: all other value types

export const getValidatorByValueType = (valueType) => {
    switch (valueType) {
        case 'NUMBER': {
            return number
        }
        default: {
            return null
        }
    }
}
