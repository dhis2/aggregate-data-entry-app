import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import React, {
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from 'react'
import { Sections, FormSection } from './section'
import { DataSetSelector } from './dataset-selector'
import { hashArraysInObject } from './utils'
import { MetadataContext } from './metadata-context'
import { DefaultForm } from './default-form'

const ngeleId = 'DiszpKrYNg8'
const period = '202112'
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
            fields: `id,name,displayName,displayFormName,formType,renderAsTabs,
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
        resource: 'dataValueSets',
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

const useDataValues = (selectedDataSet, attributeOptionCombo) => {
    const {
        data: dataValues,
        refetch,
        ...rest
    } = useDataQuery(dataValueQuery, {
        variables: {
            dataSetId: selectedDataSet,
            period,
            orgUnitId: ngeleId,
            attributeOptionCombo: attrOptionComboId,
        },
        lazy: true,
    })

    useEffect(() => {
        refetch({
            dataSetId: selectedDataSet,
            attributeOptionCombo:
                selectedDataSet === emergencyDataSetId
                    ? attrOptionComboId
                    : undefined,
        })
    }, [selectedDataSet, attributeOptionCombo])

    return { ...rest, refetch, dataValues: dataValues?.dataValues }
}

// Sections: dataSet.sections => api/sections/<id> endpoint
// dataSet.renderAsTabs or .renderHorizontally
//const transformData = (metadata) =>

export const DataWorkspace = () => {
    const [selectedDataset, setSelectedDataset] = useState(emergencyDataSetId)
    const {
        data: dataSet,
        loading,
        error,
        refetch,
    } = useDataQuery(query, {
        variables: { ou: ngeleId, id: selectedDataset },
    })

    const { metadata, setMetadata } = useContext(MetadataContext)

    const { data: meta, loading: metaLoading } = useDataQuery(metadataQuery, {
        onComplete: (metadata) => {
            const hashed =
                metadata?.metadata && hashArraysInObject(metadata.metadata)
            setMetadata(hashed)
        },
    })

    const { dataValues } = useDataValues(selectedDataset, attrOptionComboId)
    console.log({ metadata }, { dataValues }, { dataSet })

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
        const formType = dataSet.dataSet.formType
        if (formType === 'SECTION') {
            return (
                <>
                    {/* Example CC Table section rendered here: */}
                    {dataSet.dataSet.sections.map((s) => (
                        <FormSection
                            section={s}
                            key={s.id}
                            getDataValue={getDataValue}
                        />
                    ))}
                </>
            )
        } else if (formType === 'DEFAULT') {
            return (
                <DefaultForm
                    dataSet={dataSet.dataSet}
                    getDataValue={getDataValue}
                />
            )
        } else if (formType === 'CUSTOM') {
            return (
                <NoticeBox title="Not implemented" warning>
                    This data set uses a custom form. Custom forms are not
                    implemented yet.
                </NoticeBox>
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
