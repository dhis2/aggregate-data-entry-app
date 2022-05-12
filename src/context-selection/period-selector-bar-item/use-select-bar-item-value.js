import { usePeriod } from '../../shared/index.js'
import { usePeriodId } from '../use-context-selection/index.js'

export default function useSelectorBarItemValue() {
    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)
    return selectedPeriod?.displayName
}
