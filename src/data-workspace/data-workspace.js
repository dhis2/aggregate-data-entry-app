import { useDataQuery } from '@dhis2/app-runtime'
import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
    CircularLoader,
} from '@dhis2/ui'
import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Sections, FormSection } from './section'
import { DataSetSelector } from './dataset-selector'
import {
    getCategoryCombosByDataElements,
    getCategoryOptionCombosByCategoryComboId,
    getDataElementsByDataSetId,
    getDataSetById,
} from './selectors'
import { hashArraysInObject } from './utils'
import { MetadataContext } from './metadata-context'
const ngeleId = 'DiszpKrYNg8'
const period = '202111'
const emergencyDataSetId = 'Lpw6GcnTrmS'
const expendituresDataSetId = 'rsyjyJmYD4J'
const catComboId = 'WBW7RjsApsv'
const attrOptionComboId = 'gQhAMdimKO4' //result
const defaultCatComboId = 'bjDvmb4bfuf'
const urbanRuralCatOptCombo = 'DJXmyhnquyI'
const defaultCatOptComboId = 'HllvX50cXC0'

const query = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: `id,name,displayName,displayFormName,formType,
            dataSetElements[dataElement[id,name,formName,
            categoryCombo[id,name,categories[id,displayName,categoryOptions[id,displayName]],categoryOptionCombos[id,name]]]],
            sections[:owner,displayName,categoryCombos[id,categories[id,displayName,categoryOptions[id,displayName]]]]`,
        },
        // want dataSet.dataSetElements for rows & columns
        // elements with a COC other than 'default' should have a new table section
    },
    // dataValues: {
    //     resource: 'dataValueSets',
    //     params: {
    //         dataSet: emergencyDataSetId,
    //         period: period,
    //         orgUnit: ngeleId,
    //         attributeOptionCombo: attrOptionComboId,
    //     },
    // },
}

const dataValueQuery = {
    dataValues: {
        resource: 'datgitaValueSets',
        params: ({ dataSetId, period, orgUnitId, attributeOptionCombo }) => ({
            dataSet: dataSetId,
            period: period,
            orgUnit: orgUnitId,
            attributeOptionCombo,
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

// Sections: dataSet.sections => api/sections/<id> endpoint
// dataSet.renderAsTabs or .renderHorizontally
//const transformData = (metadata) =>

export const DataWorkspace = () => {
    const [selectedDataset, setSelectedDataset] = useState(emergencyDataSetId)
    const { data, loading, error, refetch } = useDataQuery(query, {
        variables: { ou: ngeleId, id: selectedDataset },
    })
    const { setMetadata } = useContext(MetadataContext)

    const { data: metadata, loading: metaLoading } = useDataQuery(metadataQuery)
    console.log({ metadata })

    const hashed = useMemo(() => {
        const hashed =
            metadata?.metadata && hashArraysInObject(metadata.metadata)
        return hashed
    }, [metadata])

    // cannot set context while rendering
    useEffect(() => {
        setMetadata(hashed)
    }, [hashed])

    console.log({ hashed })
    useEffect(() => {
        refetch({
            id: selectedDataset,
        })
    }, [selectedDataset])

    if (loading) {
        return <CircularLoader />
    }

    if (error) {
        return 'Error!'
    }

    const getForm = () => {
        // TODO: handle other form types
        if (data.dataSet.formType === 'SECTION') {
            return (
                <>
                    {/* Example CC Table section rendered here: */}
                    {data.dataSet.sections.map((s) => (
                        <FormSection section={s} key={s.id} />
                    ))}
                </>
            )
        }
    }
    return (
        <div className="workspace-wrapper">
            <DataSetSelector
                onDataSetSelect={(val) => setSelectedDataset(val.selected)}
                selected={selectedDataset}
            />
            {getForm()}
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
