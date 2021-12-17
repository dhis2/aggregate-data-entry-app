import i18n from '@dhis2/d2-i18n'
import { useCategoryOptionComboSelection } from '../use-context-selection.js'
import useCategoryCombination from './use-category-combination.js'

export default function useValueLabel() {
    const [categoryOptionComboSelection] = useCategoryOptionComboSelection()
    const {
        calledCategoryCombination,
        loadingCategoryCombination,
        errorCategoryCombination,
        categoryCombination,
    } = useCategoryCombination()

    if (!calledCategoryCombination || loadingCategoryCombination) {
        return i18n.t('Loading...')
    }

    if (errorCategoryCombination) {
        return i18n.t('An error loading the values occurred')
    }

    if (!categoryOptionComboSelection.length) {
        return i18n.t('No selection!')
    }

    if (
        categoryCombination &&
        categoryOptionComboSelection.length <
            categoryCombination.categories.length
    ) {
        return i18n.t('Partial selection!')
    }

    if (
        categoryCombination &&
        categoryOptionComboSelection.length ===
            categoryCombination.categories.length
    ) {
        return i18n.t('Complete selection!')
    }

    const error = new Error('Case not implemented!')
    if (process.env.NODE_ENV === 'production') {
        console.error(error)
    } else {
        throw error
    }
}
