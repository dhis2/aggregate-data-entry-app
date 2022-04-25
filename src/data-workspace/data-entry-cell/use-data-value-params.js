import { useContextSelection } from '../../context-selection/index.js'
import { useMetadata } from '../../metadata/index.js'
import {
    getCategoryComboById,
    getDataSetById,
} from '../../metadata/selectors.js'

export const useDataValueParams = ({ deId, cocId }) => {
    const [dataEntryContext] = useContextSelection()
    const metadataFetch = useMetadata()

    if (metadataFetch.isLoading || metadataFetch.isError) {
        return null
    }

    const { dataSetId, orgUnitId, periodId, attributeOptionComboSelection } =
        dataEntryContext

    const attributeComboId = getDataSetById(metadataFetch.data, dataSetId)
        .categoryCombo.id
    const isDefaultAttributeCombo = getCategoryComboById(
        metadataFetch.data,
        attributeComboId
    ).isDefault

    const dataValueParams = {
        de: deId,
        co: cocId,
        ds: dataSetId,
        ou: orgUnitId,
        pe: periodId,
    }
    // Add attribute params to mutation if relevant
    if (!isDefaultAttributeCombo) {
        // Get a ';'-separated listed of attribute options
        const attributeOptionIdList = Object.values(
            attributeOptionComboSelection
        ).join(';')
        dataValueParams.cc = attributeComboId
        dataValueParams.cp = attributeOptionIdList
    }

    return dataValueParams
}
