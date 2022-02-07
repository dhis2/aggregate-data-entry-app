import i18n from '@dhis2/d2-i18n'
import { useAttributeOptionComboSelection } from '../use-context-selection/index.js'

export default function useSelectorBarItemValue(categoryCombination) {
    const [attributeOptionComboSelection] = useAttributeOptionComboSelection()

    if (!categoryCombination.called || categoryCombination.loading) {
        return i18n.t('Loading...')
    }

    if (categoryCombination.error) {
        return i18n.t('An error loading the values occurred')
    }

    if (
        !Object.values(attributeOptionComboSelection).length ||
        !categoryCombination.data
    ) {
        return i18n.t('0 selections')
    }

    return i18n.t('{{amount}} selections', {
        amount: Object.values(attributeOptionComboSelection).length
    })
}
