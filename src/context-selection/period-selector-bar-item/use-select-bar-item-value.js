import { usePeriod, usePeriodId } from '../../shared/index.js'

export default function useSelectorBarItemValue() {
    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)
    return selectedPeriod?.displayName
}
