import i18n from '@dhis2/d2-i18n'
import { useAttributeOptionComboSelection } from '../use-context-selection/index.js'
import useCategoryCombination from './use-category-combination.js'

export default function useSelectorBarItemValue() {
    const [attributeOptionComboSelection] = useAttributeOptionComboSelection()
    const categoryCombination = useCategoryCombination()

    if (!categoryCombination.called || categoryCombination.loading) {
        return i18n.t('Loading...')
    }

    if (categoryCombination.error) {
        return i18n.t('An error loading the values occurred')
    }

    if (!attributeOptionComboSelection.length) {
        return i18n.t('No selection!')
    }

    if (
        categoryCombination.data &&
        attributeOptionComboSelection.length <
            categoryCombination.data.categories.length
    ) {
        return i18n.t('Partial selection!')
    }

    if (
        categoryCombination.data &&
        attributeOptionComboSelection.length ===
            categoryCombination.data.categories.length
    ) {
        return i18n.t('Complete selection!')
    }

    const error = new Error('Case not implemented!')

    if (process.env.NODE_ENV !== 'production') {
        throw error
    } else {
        console.error(error)
    }

    return ''
}
