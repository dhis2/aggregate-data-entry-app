import { useContextSelection } from '../use-context-selection.js'

export default function useShouldHideClearButton() {
    const [selection] = useContextSelection()

    if (
        !selection.orgUnitId &&
        !selection.periodId &&
        !selection.categoryOptionComboSelection.length &&
        !selection.sectionFilter
    ) {
        return true
    }

    return false
}
