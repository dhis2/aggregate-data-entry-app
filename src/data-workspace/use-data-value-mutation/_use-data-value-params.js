import {
    useContextSelection,
    useApiAttributeParams,
} from '../../shared/index.js'

/**
 * Formats a de/coc pair and the current context selection for use with the
 * `dataValues` API
 */
export const useDataValueParams = ({ deId, cocId }) => {
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const { attributeCombo, attributeOptions } = useApiAttributeParams()

    const dataValueParams = {
        de: deId,
        co: cocId,
        ds: dataSetId,
        ou: orgUnitId,
        pe: periodId,
    }

    // Add attribute params to context params if attribute is not default
    // (useApiAttributeParams helper returns undefined props if attribute
    // is default)
    if (attributeCombo) {
        // Get a ';'-separated listed of attribute options
        const attributeOptionIdList = attributeOptions.join(';')
        dataValueParams.cc = attributeCombo
        dataValueParams.cp = attributeOptionIdList
    }

    return dataValueParams
}
