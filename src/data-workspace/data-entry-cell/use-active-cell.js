import { useFormState } from 'react-final-form'
import { parseFieldId } from '../get-field-id.js'

export const useActiveCell = () => {
    const { active } = useFormState({ subscription: { active: true } })

    const { dataElementId: deId, categoryOptionComboId: cocId } =
        parseFieldId(active)
    // Optional category option IDs (requires useMetadata hook):
    // const coIds = active
    //     ? getCategoryOptionComboById(metadata, cocId).categoryOptions
    //     : []

    return {
        active,
        deId,
        cocId,
    }
}
