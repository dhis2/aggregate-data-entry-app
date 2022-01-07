import i18n from '@dhis2/d2-i18n'
import { useCategoryOptionComboSelection } from '../use-context-selection.js'
import useCategoryCombination from './use-category-combination.js'

export default function useSelectorBarItemValue() {
    const [categoryOptionComboSelection] = useCategoryOptionComboSelection()
    const categoryCombination = useCategoryCombination()

    if (!categoryCombination.called || categoryCombination.loading) {
        return i18n.t('Loading...')
    }

    if (categoryCombination.error) {
        return i18n.t('An error loading the values occurred')
    }

    if (!categoryOptionComboSelection.length) {
        return i18n.t('No selection!')
    }

    if (
        categoryCombination.data &&
        categoryOptionComboSelection.length <
            categoryCombination.data.categories.length
    ) {
        return i18n.t('Partial selection!')
    }

    if (
        categoryCombination.data &&
        categoryOptionComboSelection.length ===
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
