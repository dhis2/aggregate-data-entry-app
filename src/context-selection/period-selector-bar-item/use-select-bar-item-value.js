import i18n from '@dhis2/d2-i18n'
import { usePeriod } from '../../shared/index.js'
import { usePeriodId } from '../use-context-selection.js'
import useDataSetPeriodType from './use-data-set-period-type.js'

export default function useSelectorBarItemValue() {
    const [periodId] = usePeriodId()
    const dataSetPeriodType = useDataSetPeriodType()
    const selectedPeriod = usePeriod(periodId)

    if (dataSetPeriodType.loading) {
        return i18n.t('Fetching data set info')
    }

    if (dataSetPeriodType.error) {
        return i18n.t('Error occurred while loading data set info')
    }

    return selectedPeriod?.displayName
}
