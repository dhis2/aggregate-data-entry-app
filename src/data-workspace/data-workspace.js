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
import { DataTable } from './data-table.js'
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
        id: emergencyDataSetId,
        params: {
            fields: `id,name,displayName,displayFormName,formType,
            dataSetElements[dataElement[id,name,formName,
            categoryCombo[id,name,categories[id,displayName,categoryOptions[id,displayName]],categoryOptionCombos[id,name]]]],
            sections[:owner,displayName,categoryCombos[id,categories[id,displayName,categoryOptions[id,displayName]]]]`,
        },
        // want dataSet.dataSetElements for rows & columns
        // elements with a COC other than 'default' should have a new table section
    },
    dataValues: {
        resource: 'dataValueSets',
        params: {
            dataSet: emergencyDataSetId,
            period: period,
            orgUnit: ngeleId,
            attributeOptionCombo: attrOptionComboId,
        },
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

    useEffect(() => {
        setMetadata(hashed)
    }, [hashed])

    console.log({ hashed })
    useEffect(() => {
        refetch({
            variables: {
                id: selectedDataset,
            },
        })
    }, [selectedDataset])

    // todo: split up table by category combos
    // if catCombo.name === 'default' => columnTitle = 'Value'

    if (loading) {
        return <CircularLoader />
    }

    if (error) {
        return 'Error!'
    }

    // if (this is a 'SECTION' type) for each section: (or whole table for 'DEFAULT')
    // if (multiple catCombos in data elements) then { need to make separate subsections }
    // catCombosInSection.map(catCombo => {
    //
    // })

    // 'Section' form: Form > Form section > Entry table > Category Combination Table Section
    // 'Default' form: Form > Entry table > Category combination Table Section
    const getSectionDataElements = (s) =>
        data.dataSet.dataSetElements.filter((dse) =>
            s.dataElements.find((sde) => sde.id === dse.dataElement.id)
        )
    // result: { categoryCombo, dataElement: { ... } }
    // sort by category combo
    // handle rows differently by CC

    // Need name
    // Need cell for each option in category (combo?)
    // Populate cell with value for data element x COC
    // dataSetElement => catCombo => catOptCombos => forEach: get value from dataValueSet
    //const formatDataElements = ()
    console.log(data)

    // * Making table
    // Could iterate over data.dataSet.sections
    const sectionDataElements = getSectionDataElements(data.dataSet.sections[1])
    // want to get [{ dataElements: [], categoryOptionCombos: []}]
    const sectionCategoryCombos = sectionDataElements.reduce((ccs, dse) => {
        const categoryCombo = dse.dataElement.categoryCombo
        const ccId = categoryCombo.id
        if (!ccs[ccId]) {
            ccs[ccId] = {
                dataElements: [dse.dataElement],
                categoryOptionCombos: categoryCombo.categoryOptionCombos,
            }
        } else {
            ccs[ccId].dataElements.push(dse.dataElement)
        }
        return ccs
    }, [])
    // console.log({ sectionCategoryCombos })
    // hopefully results in { ccId1: { dataElements: [de1, de2], categoryOptionCombos: [coc1, coc2] }, ccId2: ... }
    // ex: { DJXmyhnquyI: { dataElements: [...], categoryOptionCombos: [{ id: "mPBwiaWc2sk", name: "Rural" }, { id: "IGhnY0XeHXe", name: "Urban" }] } }
    // (There is just one category combo in this section)

    // for each category combo in section, make a category combo table section
    // rows = dataElements, columns = categoryOptionCombos
    // for illustration purposes, just grabbing the first CC table section (CCTS).
    // in the future, should iterate over all CCTSs
    const exampleCC =
        sectionCategoryCombos[Object.keys(sectionCategoryCombos)[0]]

    // Get a cell's data value from the DE ID and COC ID
    // todo: use this to populate the matrix
    const getDataValue = (dataElementId, categoryOptionComboId) => {
        const dataValue = data.dataValues.dataValues.find(
            (dv) =>
                dv.dataElement === dataElementId &&
                dv.categoryOptionCombo === categoryOptionComboId
        )
        return dataValue.value
    }

    const exampleCCTableSection = (
        <Table>
            <TableHead>
                {/* Will need to handle multiple-category combos with multiple header rows */}
                <TableRowHead>
                    {/* TODO: should be category name */}
                    <TableCellHead />
                    {/* For each category option combo in this category combo, render a column */}
                    {exampleCC.categoryOptionCombos.map((coc) => (
                        <TableCellHead key={coc.id}>{coc.name}</TableCellHead>
                    ))}
                </TableRowHead>
            </TableHead>
            <TableBody>
                {/* For each data element, render a row */}
                {exampleCC.dataElements.map((de) => {
                    return (
                        <TableRow key={de.id}>
                            <TableCellHead>{de.formName}</TableCellHead>
                            {exampleCC.categoryOptionCombos.map((coc) => (
                                <TableCell key={coc.id}>
                                    {getDataValue(de.id, coc.id)}
                                </TableCell>
                            ))}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )

    //const getDataElementCells = (coc) => coc.map()
    /**
     * Intended result:
     * { name: string, description: string,
     * categoryComboTableSections: { [id]: { columns: [], rows: [] } } }
     */
    function mapSectionToFormSectionObject(section) {
        // COULD be refactored to section.dataElements.map(findElementFromDataSetElements)
        const sectionDataElements = getSectionDataElements(section)
        const categoryCombos = section.categoryCombos
        console.log({ section, sectionDataElements })

        // todo: abstract out for reuse by 'default' form type
        const sectionCategoryComboTableSections = sectionDataElements.reduce(
            (ccs, dse) => {
                const cc = dse.dataElement.categoryCombo
                if (!ccs[cc.id]) {
                    ccs[cc.id] = {
                        dataElements: [
                            {
                                ...dse.dataElement,
                                cells: ['iterate over cocs'],
                            },
                        ],
                        categoryCombo: { ...cc }, // need category options too --
                    }
                } else {
                    ccs[cc.id].dataElements.push(dse.dataElement)
                }
                return ccs
            },
            {}
        )

        return {
            name: section.displayName,
            description: section.description, // might be "" or undefined
            categoryCombos: sectionCategoryComboTableSections,
        }
    }

    const sectionObjs = data.dataSet.sections.map(mapSectionToFormSectionObject)
    console.log({ sectionObjs })
    const defaultFormObject = {}

    const sectionFormObject = {
        // todo: sort sections by section.sortOrder
        // data.form.groups.map(mapSectionToFormSectionObject)
        sections: [
            {
                name: 'Training',
                description: 'asdf',
                categoryCombos: {
                    ccId1: 'A CCTS matrix', // i.e. { columns: [], rows: [] } COCs = columns
                    ccId2: { dataElements: [], categoryOptionCombos: [] }, // different COCs
                },
            },
            { name: 'Support', description: 'asdf', sectionCategoryCombos },
        ],
        otherProperties: {},
    }
    // Math.max(Object.keys(sectionCategoryCombos).) find max column
    const cctsMatrix = {
        categoryCombos: [
            { id: 'id1', name: 'catA', options: ['catOptA1', 'catOptA2'] },
            { id: 'id2', name: 'catB', options: ['catOptB1', 'catOptB2'] },
        ],
        dataElements: [
            { id: 'id1', name: 'asdf', cells: ['...cell objects'] },
            { id: 'id2', name: 'qwerty', cells: ['...cell objects'] },
        ],
    }

    const cellObject = {
        dataElement: 'deId',
        categoryCombo: 'ccId', // need this one? section/row relative
        categoryOptionCombo: 'cocId',
        value: 'value',
        type: 'NUMBER',
    }

    // If section => iterate over sections; for each section, render "form section" wrapper component;
    // in each form section, render CCTSs (Maybe in tabs)
    // Form section wrapper has section name & description, and "section filter" field
    // TODO: Make sure we have an example with multiple Cat.Combos in ONE section to test out CCTSs

    // If default => render CCTSs; don't need "Form section" wrapper

    // If CUSTOM form => just render that? 'dangerouslySetInnerHtml'
    // Need to replace entry cells with our custom entry cells somehow

    const getForm = () => {
        // TODO: handle other form types
        if (data.dataSet.formType === 'SECTION') {
            return (
                <>
                    {loading ? (
                        <CircularLoader />
                    ) : (
                        <DataTable
                            metadata={hashed}
                            dataSetId={selectedDataset}
                            orgUnitId={ngeleId}
                            period={period}
                            attributeOptionCombo={defaultCatOptComboId}
                        />
                    )}
                    {/* Example CC Table section rendered here: */}
                    {exampleCCTableSection}
                    {data.dataSet.sections.map((s) => (
                        <FormSection section={s} key={s.id}>
                            {getSectionDataElements(s).map(
                                ({ dataElement }) => {
                                    return (
                                        <div key={dataElement.id}>
                                            {dataElement.formName}
                                        </div>
                                    )
                                }
                            )}
                            {/* Then split up section data elements by category combo */}
                            {/* For each CC, render CC table section */}
                        </FormSection>
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
