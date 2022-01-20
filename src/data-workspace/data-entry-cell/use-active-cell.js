import { useFormState } from 'react-final-form'

export const useActiveCell = () => {
    const { active } = useFormState({ subscription: { active: true } })

    const [deId, cocId] = active ? active.split('.') : [null, null]

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
