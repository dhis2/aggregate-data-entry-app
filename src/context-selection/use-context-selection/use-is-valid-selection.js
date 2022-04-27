import { useAttributeParams } from '../attribute-option-combo-selector-bar-item/index.js'
import { useContextSelection } from '../use-context-selection/index.js'

export function useIsValidSelection() {
    const [selection] = useContextSelection()
    const { validSelection } = useAttributeParams()

    if (selection.orgUnitId && selection.periodId && validSelection) {
        return true
    }
    return false
}
