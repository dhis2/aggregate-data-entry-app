import { useConfig } from '@dhis2/app-runtime'

const shouldUtilizeGistApiForPrefetchedOrganisationUnits = (serverVersion) => {
    const { minor, patch } = serverVersion ?? {}
    if (minor >= 43) {
        return true
    }
    if (String(minor) === '42' && (patch === undefined || patch >= 2)) {
        return true
    }
    if (String(minor) === '41' && (patch === undefined || patch >= 5)) {
        return true
    }
    return String(minor) === '40' && (patch === undefined || patch >= 9)
}

export function useFeatureToggleContext() {
    const { serverVersion } = useConfig() ?? {}
    return {
        utilizeGistApiForPrefetchedOrganisationUnits:
            shouldUtilizeGistApiForPrefetchedOrganisationUnits(serverVersion),
    }
}
