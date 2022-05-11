import i18n from '@dhis2/d2-i18n'

export default function useSelectorBarItemLabel(categoryCombination) {
    return categoryCombination?.isDefault
        ? i18n.t('Default attribute combo')
        : categoryCombination?.displayName
}
