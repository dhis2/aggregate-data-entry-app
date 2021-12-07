import { useDataQuery } from '@dhis2/app-runtime'
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
    const dataValueWithDSE = data.dataValues.dataValues.map(dv => {
        const dses = data.dataSet.dataSetElements
        const dse = dses.find(dse => dse.dataElement.id === dv.dataElement)
        const catCombo = dse?.categoryCombo.categoryOptionCombos.find(coc => coc.id === dv.categoryOptionCombo)

        return {
            ...dv,
            dataElementObject: dse,
            catComboObject: catCombo
        }
    })

    // Could iterate over data.dataSet.sections
    const sectionDataElements = getSectionDataElements(data.dataSet.sections[1])
    console.log({ sectionDataElements })
    const categoryCombosInSection = sectionDataElements.reduce((ccs, dse) => {
        const ccId = dse.categoryCombo.id
        if (!ccs[ccId]) {
            ccs[ccId] = [dse]
        } else {
            ccs[ccId].push(dse)
        }
        return ccs
    }, {})
    console.log({ categoryCombosInSection })

    // hopefully results in { ccId1: [dse1, dse2], ccId2: [dse3, dse4] }

    
        
    console.log('FORMAT', dataValueWithDSE)

    if (data.dataSet.formType === 'SECTION') {
        return (
            <>
                <p>Hey!</p>
                {data.dataSet.sections.map((s) => (
                    <FormSection name={s.displayName} key={s.id}>
                        {getSectionDataElements(s).map(({ dataElement }) => {
                            console.log(dataElement)
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
