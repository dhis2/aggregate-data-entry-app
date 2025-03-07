import { useHighlightedField } from '../../shared/index.js'

export const useActiveCell = () => {
    const highlighted = useHighlightedField() || {}

    const { dataElement: deId, categoryOptionCombo: cocId } = highlighted
    // Optional category option IDs (requires useMetadata hook):
    // const coIds = active
    //     ? getCategoryOptionComboById(metadata, cocId).categoryOptions
    //     : []

    return {
        deId,
        cocId,
    }
}
