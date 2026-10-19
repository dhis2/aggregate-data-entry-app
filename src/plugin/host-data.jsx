import { useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    dataValueSetQueryKey,
    HostDataContext,
    metadataQueryKey,
} from '../shared/index.js'

// useDataValueSet's key, built from the raw metadata before it is cached
const dataValuesQueryKey = (
    metadata,
    { dataSetId, orgUnitId, periodId, attributeOptionComboSelection }
) => {
    const dataSet = metadata.dataSets?.find(({ id }) => id === dataSetId)
    const categoryCombo = metadata.categoryCombos?.find(
        ({ id }) => id === dataSet?.categoryCombo?.id
    )
    const hasAttributes = Boolean(categoryCombo && !categoryCombo.isDefault)
    return dataValueSetQueryKey.byIds({
        dataSetId,
        periodId,
        orgUnitId,
        categoryComboId: hasAttributes ? categoryCombo.id : undefined,
        // sorted, as useApiAttributeParams sorts them
        categoryOptionIds: hasAttributes
            ? Object.values(attributeOptionComboSelection ?? {}).sort()
            : undefined,
    })
}

/*
 * SPIKE (DHIS2-22048): caches the host's metadata and dataValues responses
 * before the workspace renders, so it doesn't fetch them itself.
 */
export const HostData = ({ metadata, dataValues, selection, children }) => {
    const queryClient = useQueryClient()
    const fromHost = Boolean(metadata && dataValues)
    const [seeded, setSeeded] = useState(!fromHost)

    useEffect(() => {
        if (!fromHost) {
            return
        }
        queryClient.setQueryData(metadataQueryKey, metadata)
        queryClient.setQueryData(
            dataValuesQueryKey(metadata, selection),
            dataValues
        )
        setSeeded(true)
    }, [fromHost, queryClient, metadata, dataValues, selection])

    if (!seeded) {
        return null
    }
    return (
        <HostDataContext.Provider value={fromHost}>
            {children}
        </HostDataContext.Provider>
    )
}

HostData.propTypes = {
    children: PropTypes.node,
    dataValues: PropTypes.object,
    metadata: PropTypes.object,
    selection: PropTypes.shape({
        attributeOptionComboSelection: PropTypes.objectOf(PropTypes.string),
        dataSetId: PropTypes.string,
        orgUnitId: PropTypes.string,
        periodId: PropTypes.string,
    }),
}
