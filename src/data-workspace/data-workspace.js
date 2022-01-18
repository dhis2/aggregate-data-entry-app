import { CircularLoader } from '@dhis2/ui'
import React, { useMemo, useCallback } from 'react'
import { useQuery } from 'react-query'
import { useContextSelection } from '../context-selection/index.js'
import { FinalFormWrapper } from './data-entry-cell/index.js'
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

const metadataQuery = {
    metadata: {
        resource: 'metadata',
        params: {
            // Note: on dataSet.dataSetElement, the categoryCombo property is
            // included because it can mean it's overriding the data element's
            // native categoryCombo. It can sometimes be absent from the data
            // set element
            'dataSets:fields':
                'id,displayFormName,formType,dataSetElements[dataElement,categoryCombo],categoryCombo,sections~pluck',
            'dataElements:fields': 'id,displayFormName,categoryCombo,valueType',
            'sections:fields':
                'id,displayName,sortOrder,showRowTotals,showColumnTotals,disableDataElementAutoGroup,greyedFields[id],categoryCombos~pluck,dataElements~pluck,indicators~pluck',
            'categoryCombos:fields':
                'id,skipTotal,categories~pluck,categoryOptionCombos~pluck,isDefault',
            'categories:fields': 'id,displayFormName,categoryOptions~pluck',
            'categoryOptions:fields':
                'id,displayFormName,categoryOptionCombos~pluck,categoryOptionGroups~pluck,isDefault',
            'categoryOptionCombos:fields':
                'id,categoryOptions~pluck,categoryCombo,name',
        },
    },
}

const useDataValues = () => {
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const attributeOptionComboId = useAttributeOptionCombo()

    return useQuery([
        dataValueQuery,
        {
            dataSetId,
            periodId,
            orgUnitId,
            attributeOptionComboId,
        },
    ])
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
    const dataSetFetch = useQuery([
        query,
        {
            id: dataSetId,
        },
    ])

    const { available, metadata, setMetadata } = useMetadata()
    useQuery([metadataQuery], {
        staleTime: 60 * 24 * 1000,
        refetchOnWindowFocus: false,
        onSuccess: (data) => setMetadata(data.metadata),
    })

    const dataValuesFetch = useDataValues()
    console.log({ metadata }, { dataValues: dataValuesFetch.data }, { dataSet: dataSetFetch.data })

    const getDataValue = useCallback(
        (dataElementId, cocId) => {
            return dataValuesFetch.data?.dataValues.find(
                (dv) =>
                    dv.dataElement === dataElementId &&
                    dv.categoryOptionCombo === cocId
            )
        },
        [dataValuesFetch.data]
    )

    if (!dataSetId || !orgUnitId || !periodId || !attributeOptionComboId) {
        return null
    }

    if (!available || dataSetFetch.isLoading || dataValuesFetch.isLoading) {
        return <CircularLoader />
    }

    if (dataSetFetch.error) {
        return 'Error!'
    }

    return (
        <div className="workspace-wrapper">
            <FinalFormWrapper
                initialValues={mapDataValuesToFormInitialValues(
                    dataValuesFetch.data.dataValues.dataValues
                )}
            >
                <EntryForm
                    dataSet={dataSetFetch.data.dataSet}
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
