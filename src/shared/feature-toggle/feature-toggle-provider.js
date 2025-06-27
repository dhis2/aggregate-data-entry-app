import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { FeatureToggleContext } from './feature-toggle-context.js'

const shouldUtilizeGistApiForPrefetchedOrganisationUnits = (serverVersion) => {
    const { minor, patch } = serverVersion ?? {}
    if (minor >= 43) {
        return true
    }
    if (minor === '42' && (!patch || patch >= 1)) {
        return true
    }
    if (minor === '41' && (!patch || patch >= 5)) {
        return true
    }
    return minor === '40' && (!patch || patch >= 9)
}

export function FeatureToggleProvider({ children }) {
    const { serverVersion } = useConfig() ?? {}

    const value = useMemo(
        () => ({
            utilizeGistApiForPrefetchedOrganisationUnits:
                shouldUtilizeGistApiForPrefetchedOrganisationUnits(
                    serverVersion
                ),
        }),
        [serverVersion]
    )

    return (
        <FeatureToggleContext.Provider value={value}>
            {children}
        </FeatureToggleContext.Provider>
    )
}

FeatureToggleProvider.propTypes = {
    children: PropTypes.any.isRequired,
}
