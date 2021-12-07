import { useDataQuery } from '@dhis2/app-runtime'
import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import React from 'react'
import { Sections, FormSection } from './section'
const ngeleId = 'DiszpKrYNg8'
const pe = '202108'
const emergencyDataSetId = 'Lpw6GcnTrmS'
const expendituresDataSetId = 'rsyjyJmYD4J'
const catComboId = 'WBW7RjsApsv'
const attrOptionComboId = 'gQhAMdimKO4' //result
const defaultCatOptComboId = 'bjDvmb4bfuf'
const urbanRuralCatOptCombo = 'DJXmyhnquyI'

const query = {
    dataSet: {
        resource: 'dataSets',
        id: emergencyDataSetId,
        params: {
            fields: `id,name,displayName,displayFormName,formType,dataSetElements[dataElement[id,name, formName],
                categoryCombo[id,name,
                categoryOptionCombos[id,name]]],
                sections[id,displayName,sortOrder,dataElements[id]]`,
        },
        // want dataSet.dataSetElements for rows & columns
        // elements with a COC other than 'default' should have a new table section
    },
    dataValues: {
        resource: 'dataValueSets',
        params: {
            dataSet: emergencyDataSetId,
            period: pe,
            orgUnit: ngeleId,
            attributeOptionCombo: attrOptionComboId,
        },
    },
}

// Sections: dataSet.sections => api/sections/<id> endpoint
// dataSet.renderAsTabs or .renderHorizontally

const DataWorkspace = () => {
    const { data, loading, error } = useDataQuery(query)

    // todo: split up table by category combos
    // if catCombo.name === 'default' => columnTitle = 'Value'

    if (loading) {
        return 'Loading...'
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
    // dataElements
    // categoryComboOption
    // dataElement-catcomboId
    const dataValueWithDSE = data.dataValues.dataValues.map((dv) => {
        const dses = data.dataSet.dataSetElements
        const dse = dses.find((dse) => dse.dataElement.id === dv.dataElement)
        const catCombo = dse?.categoryCombo.categoryOptionCombos.find(
            (coc) => coc.id === dv.categoryOptionCombo
        )

        return {
            ...dv,
            dataElementObject: dse,
            catComboObject: catCombo,
        }
    })

    // * Making table
    // Could iterate over data.dataSet.sections
    const sectionDataElements = getSectionDataElements(data.dataSet.sections[1])
    // want to get [{ dataElements: [], categoryOptionCombos: []}]
    const sectionCategoryCombos = sectionDataElements.reduce((ccs, dse) => {
        const ccId = dse.categoryCombo.id
        if (!ccs[ccId]) {
            ccs[ccId] = {
                dataElements: [dse.dataElement],
                categoryOptionCombos: dse.categoryCombo.categoryOptionCombos,
            }
        } else {
            ccs[ccId].dataElements.push(dse.dataElement)
        }
        return ccs
    }, [])
    console.log({ sectionCategoryCombos })
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

    console.log('FORMAT', dataValueWithDSE)

    if (data.dataSet.formType === 'SECTION') {
        return (
            <>
                {/* Example CC Table section rendered here: */}
                {exampleCCTableSection}
                <p>Hey!</p>
                {data.dataSet.sections.map((s) => (
                    <FormSection name={s.displayName} key={s.id}>
                        {getSectionDataElements(s).map(({ dataElement }) => {
                            return (
                                <div key={dataElement.id}>
                                    {dataElement.formName} an item
                                </div>
                            )
                        })}
                        {/* Then split up section data elements by category combo */}
                        {/* For each CC, render CC table section */}
                    </FormSection>
                ))}
            </>
        )
    }
    return 'hi'
}

export default DataWorkspace
