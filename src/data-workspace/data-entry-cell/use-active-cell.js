import { useFormState } from 'react-final-form'
import { useMetadata } from '../metadata-context.js'

export const useActiveCell = () => {
    const { active } = useFormState({ subscription: { active: true } })
    const { metadata } = useMetadata()

    const [deId, cocId] = active ? active.split('.') : [null, null]
    const coIds = active
        ? metadata.categoryOptionCombos[cocId].categoryOptions
        : []

    return {
        active,
        deId,
        cocId,
        coIds,
    }
}
