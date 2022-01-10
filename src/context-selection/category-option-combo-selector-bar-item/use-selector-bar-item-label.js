import i18n from '@dhis2/d2-i18n'
import useCategoryCombination from './use-category-combination.js'

export default function useSelectorBarItemLabel() {
    const categoryCombination = useCategoryCombination()

    if (!categoryCombination.called || categoryCombination.loading) {
        return i18n.t('Loading categories...')
    }

    if (categoryCombination.error) {
        return i18n.t('Category option combination: An error occurred', {
            nsSeparator: '-:-',
        })
    }

    return categoryCombination.data?.displayName
}
