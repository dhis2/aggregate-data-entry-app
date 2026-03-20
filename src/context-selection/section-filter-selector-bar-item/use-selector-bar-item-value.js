import i18n from '@dhis2/d2-i18n'
import { useSectionFilter } from '../../shared/index.js'
import useDataSetAdditionalInfo from './use-data-set-additional-info.js'

export default function useSelectorBarItemValue() {
    const [sectionFilter] = useSectionFilter()
    const dataSetSectionsInfo = useDataSetAdditionalInfo()

    if (!sectionFilter) {
        return undefined
    }

    const loading = !dataSetSectionsInfo.called || dataSetSectionsInfo.loading
    if (loading) {
        return i18n.t('Fetching data set info')
    }

    if (dataSetSectionsInfo.error) {
        return i18n.t('Error occurred while loading data set info')
    }

    if (!dataSetSectionsInfo.data) {
        return undefined
    }

    const { sections } = dataSetSectionsInfo.data
    const selectedSection = sections.find(({ id }) => id === sectionFilter)
    return selectedSection?.displayName
}
