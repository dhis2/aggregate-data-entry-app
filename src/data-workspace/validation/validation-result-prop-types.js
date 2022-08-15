import PropTypes from 'prop-types'
import { validationLevels } from './validation-config.js'

export const ValidationRuleViolationWithMetaDataPropTypes = PropTypes.shape({
    metaData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        importance: PropTypes.string.isRequired,
        leftSide: PropTypes.shape({
            displayDescription: PropTypes.string.isRequired,
        }).isRequired,
        operator: PropTypes.string.isRequired,
        rightSide: PropTypes.shape({
            displayDescription: PropTypes.string.isRequired,
        }).isRequired,
        displayDescription: PropTypes.string,
        displayInstruction: PropTypes.string,
        displayName: PropTypes.string,
    }),
    validationRule: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
})

export const ImportanceLevelPropTypes = PropTypes.oneOf(validationLevels)
