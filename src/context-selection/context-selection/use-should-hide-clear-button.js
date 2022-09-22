import { useContextSelection } from '../../shared/index.js'

export default function useShouldHideClearButton() {
    const [selection] = useContextSelection()

    if (
        !selection.orgUnitId &&
        !selection.periodId &&
        !selection.attributeOptionComboSelection.length &&
        !selection.sectionFilter
    ) {
        return true
    }

    return false
}
