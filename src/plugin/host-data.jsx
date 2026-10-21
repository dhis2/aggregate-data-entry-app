import { useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { HostDataContext, useDataValueSetQueryKey } from '../shared/index.js'

/*
 * SPIKE (DHIS2-22048): caches the host's dataValues response under the key
 * useDataValueSet reads, before the workspace renders, so it doesn't fetch
 * the values itself. Needs the metadata, so it goes inside LoadApp.
 */
export const HostData = ({ dataValues, children }) => {
    const queryClient = useQueryClient()
    const queryKey = useDataValueSetQueryKey()
    const key = JSON.stringify(queryKey)
    const [seededKey, setSeededKey] = useState()

    useEffect(() => {
        if (dataValues) {
            queryClient.setQueryData(queryKey, dataValues)
            setSeededKey(key)
        }
        // key stands in for queryKey
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryClient, dataValues, key])

    if (dataValues && seededKey !== key) {
        return null
    }
    return (
        <HostDataContext.Provider value={Boolean(dataValues)}>
            {children}
        </HostDataContext.Provider>
    )
}

HostData.propTypes = {
    children: PropTypes.node,
    dataValues: PropTypes.object,
}
