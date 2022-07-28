import i18n from '@dhis2/d2-i18n'
import { useAttributeOptionComboSelection } from '../../shared/index.js'

export default function useSelectorBarItemValue(categoryCombination) {
    const [attributeOptionComboSelection] = useAttributeOptionComboSelection()

    if (categoryCombination?.isDefault) {
        return ''
    }

    if (
        !Object.values(attributeOptionComboSelection).length ||
        !categoryCombination
    ) {
        return i18n.t('0 selections')
    }

    const amount = Object.values(attributeOptionComboSelection).length

    if (amount === 1) {
        return i18n.t('1 selection')
    }

    return i18n.t('{{amount}} selections', {
        amount: Object.values(attributeOptionComboSelection).length,
    })
}
