import i18n from '@dhis2/d2-i18n'
import useDataSetOrgUnitPaths from './use-data-set-org-unit-paths.js'
import useOrgUnit from './use-organisation-unit.js'
import useUserOrgUnits from './use-user-org-units.js'

export default function useSelectorBarItemValue() {
    const orgUnit = useOrgUnit()
    const userOrgUnits = useUserOrgUnits()
    const dataSetOrgUnitPaths = useDataSetOrgUnitPaths()

    if (
        userOrgUnits.loading ||
        orgUnit.loading ||
        dataSetOrgUnitPaths.loading
    ) {
        return i18n.t('Fetching organisation unit info')
    }

    if (orgUnit.error || userOrgUnits.error || dataSetOrgUnitPaths.error) {
        return i18n.t('Error occurred while loading organisation unit info')
    }

    return orgUnit.data?.displayName
}
