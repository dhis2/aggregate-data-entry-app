import i18n from '@dhis2/d2-i18n'

export default function useSelectorBarItemLabel(categoryCombination) {

    if (!categoryCombination.called || categoryCombination.loading) {
        return i18n.t('Loading categories...')
    }

    if (categoryCombination.error) {
        return i18n.t('Attribute option combination: An error occurred', {
            nsSeparator: '-:-',
        })
    }

    return categoryCombination.data?.displayName
}
