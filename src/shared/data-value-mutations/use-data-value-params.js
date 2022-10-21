import { useMemo } from 'react'
import { useApiAttributeParams } from '../use-api-attribute-params.js'
import { useContextSelection } from '../use-context-selection/index.js'
/**
 * Formats a de/coc pair and the current context selection for use with the
 * `api/dataValues` endpoint
 */
export const useDataValueParams = ({ deId, cocId }) => {
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const { attributeCombo, attributeOptions } = useApiAttributeParams()

    return useMemo(() => {
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
            // (note these are sorted in useApiAttributeParams)
            const attributeOptionIdList = attributeOptions.join(';')
            dataValueParams.cc = attributeCombo
            dataValueParams.cp = attributeOptionIdList
        }
        return dataValueParams
    }, [
        dataSetId,
        orgUnitId,
        periodId,
        attributeCombo,
        attributeOptions,
        cocId,
        deId,
    ])
}
