import { CircularLoader } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { useQuery, useIsMutating } from 'react-query'
import { useContextSelection } from '../context-selection/index.js'
import { useMetadata } from '../metadata/index.js'
import {
    getCoCByCategoryOptions,
    getDataSetById,
    getCategoryComboById,
} from '../metadata/selectors.js'
import {
    FinalFormWrapper,
    DATA_VALUE_MUTATION_KEY,
} from './data-entry-cell/index.js'
import styles from './data-workspace.module.css'
import { EntryForm } from './entry-form.js'

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

export const dataValueSetQuery = {
    dataValueSet: {
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

const useDataValueSet = () => {
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const attributeOptionComboId = useAttributeOptionCombo()
    const activeMutations = useIsMutating({
        mutationKey: DATA_VALUE_MUTATION_KEY,
    })

    return useQuery(
        [
            dataValueSetQuery,
            {
                dataSetId,
                periodId,
                orgUnitId,
                attributeOptionComboId,
            },
        ],
        {
            // Only enable this query if there are no ongoing mutations
            enabled: activeMutations === 0,
        }
    )
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
export const useAttributeOptionCombo = () => {
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

            const selectedOptions = Object.values(attributeOptionComboSelection)

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

    const { available, setMetadata } = useMetadata()

    useQuery([metadataQuery], {
        staleTime: 60 * 24 * 1000,
        refetchOnWindowFocus: false,
        onSuccess: (data) => setMetadata(data.metadata),
    })

    const dataValueSetFetch = useDataValueSet()

    if (!dataSetId || !orgUnitId || !periodId || !attributeOptionComboId) {
        return null
    }

    if (!available || dataSetFetch.isLoading || dataValueSetFetch.isLoading) {
        return <CircularLoader />
    }

    if (dataSetFetch.error) {
        return 'Error!'
    }

    return (
        <div className={styles.wrapper}>
            <FinalFormWrapper
                initialValues={mapDataValuesToFormInitialValues(
                    dataValueSetFetch.data.dataValueSet.dataValues
                )}
            >
                <EntryForm dataSet={dataSetFetch.data.dataSet} />
            </FinalFormWrapper>
        </div>
    )
}
