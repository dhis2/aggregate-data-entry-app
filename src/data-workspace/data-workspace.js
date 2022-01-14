import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import React, { useMemo, useEffect, useCallback } from 'react'
import { useContextSelection } from '../context-selection/index.js'
import { FinalFormWrapper } from './data-entry-cell.js'
import { EntryForm } from './entry-form.js'
import { useMetadata } from './metadata-context.js'
import {
    getCoCByCategoryOptions,
    getDataSetById,
    getCategoryComboById,
} from './selectors.js'

const query = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: `id,name,displayName,displayFormName,formType,renderAsTabs,
            dataSetElements[dataElement[id,name,formName,
            categoryCombo[id,name,categories[id,displayName,categoryOptions[id,displayName]],categoryOptionCombos[id,name]]]],
            sections[:owner,displayName,categoryCombos[id,categories[id,displayName,categoryOptions[id,displayName]]]]`,
        },
    },
}

const dataValueQuery = {
    dataValues: {
        resource: 'dataValueSets',
        params: ({
            dataSetId,
            periodId,
            orgUnitId,
            attributeOptionComboId,
        }) => ({
            dataSet: dataSetId,
            period: periodId,
            orgUnit: orgUnitId,
            attributeOptionCombo: attributeOptionComboId,
        }),
    },
}

const useDataValues = () => {
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const attributeOptionComboId = useAttributeOptionCombo()

    const {
        data: dataValues,
        refetch,
        ...rest
    } = useDataQuery(dataValueQuery, {
        variables: {
            dataSetId,
            periodId,
            orgUnitId,
            attributeOptionComboId,
        },
        lazy: true,
    })

    useEffect(() => {
        refetch({
            dataSetId,
            periodId,
            orgUnitId,
            attributeOptionComboId,
        })
    }, [dataSetId, orgUnitId, periodId, attributeOptionComboId])

    return { ...rest, refetch, dataValues: dataValues?.dataValues }
}

// Form value object structure: { [dataElementId]: { [cocId]: value } }
function mapDataValuesToFormInitialValues(dataValues) {
    const formInitialValues = dataValues.reduce(
        (acc, { dataElement, categoryOptionCombo, value }) => {
            if (!acc[dataElement]) {
                acc[dataElement] = { [categoryOptionCombo]: value }
            } else {
                acc[dataElement][categoryOptionCombo] = value
            }
            return acc
        },
        {}
    )
    return formInitialValues
}

// TODO: this should probably be handled by useContextSelection-hook
// should not need this when api support CC and CP instead of cocId
const useAttributeOptionCombo = () => {
    const { available, metadata } = useMetadata()
    const [{ dataSetId, attributeOptionComboSelection }] = useContextSelection()

    const cocId = useMemo(() => {
        if (available && dataSetId) {
            const dataSet = getDataSetById(metadata, dataSetId)
            const categoryCombo = getCategoryComboById(
                metadata,
                dataSet.categoryCombo.id
            )
            if (categoryCombo.isDefault) {
                // if default catCombo, selected should be default coc as well
                return categoryCombo.categoryOptionCombos[0]
            }

            const selectedOptions = attributeOptionComboSelection.map(
                (categoryOptStr) => categoryOptStr.split(':')[1]
            )

            const attributeOptionCombo = getCoCByCategoryOptions(
                metadata,
                dataSet.categoryCombo.id,
                selectedOptions
            )

            return attributeOptionCombo?.id
        }
        return null
    }, [dataSetId, attributeOptionComboSelection, metadata, available])
    return cocId
}

export const DataWorkspace = () => {
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const attributeOptionComboId = useAttributeOptionCombo()
    const {
        data: dataSet,
        loading,
        error,
        refetch,
    } = useDataQuery(query, {
        variables: {
            id: dataSetId,
        },
    })

    const { available } = useMetadata()

    const { dataValues, loading: dataValuesLoading } = useDataValues()

    const getDataValue = useCallback(
        (dataElementId, cocId) => {
            return dataValues?.dataValues.find(
                (dv) =>
                    dv.dataElement === dataElementId &&
                    dv.categoryOptionCombo === cocId
            )
        },
        [dataValues]
    )

    useEffect(() => {
        refetch({
            id: dataSetId,
        })
    }, [dataSetId])

    if (!dataSetId || !orgUnitId || !periodId || !attributeOptionComboId) {
        return null
    }

    if (!available || loading || dataValuesLoading) {
        return <CircularLoader />
    }

    if (error) {
        return 'Error!'
    }

    return (
        <div className="workspace-wrapper">
            <FinalFormWrapper
                initialValues={mapDataValuesToFormInitialValues(
                    dataValues.dataValues
                )}
            >
                <EntryForm
                    dataSet={dataSet.dataSet}
                    getDataValue={getDataValue}
                />
            </FinalFormWrapper>
            <style jsx>
                {`
                    .workspace-wrapper {
                        background-color: #fff;
                        min-width: 600px;
                        padding: 8px;
                        overflow: scroll;
                    }
                `}
            </style>
        </div>
    )
}
