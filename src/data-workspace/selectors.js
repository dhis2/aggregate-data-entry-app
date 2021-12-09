const getDataElements = (metadata) => metadata.dataElements
const getDataElementById = (metadata) => getDataElements(metadata)[id]

const listDataElementsBySectionId = (metadata, sectionId) => {
    meta
}

const getCategories = (metadata) => metadata.categories

const getCategoryCombos = (metadata) => metadata.categoryCombos

const getCategoryOptions = (metadata) => metadata.categoryOptions

const getCategoryOptionCombos = (metadata) => metadata.categoryOptionCombos

const getDataSets = (metadata) => metadata.dataSets
const getDataSetById = (metadata, dataSetId) => metadata.dataSets[dataSetId]
const getSections = (metadata) => metadata.sections

const getSectionsByDataSetId = (metadata, dataSetId) => {
    const sections = getSections(metadata)
    const dataSet = getDataSetById(metadata, dataSetId)

    return dataSet.sections.map((sId) => sections[sId])
}

const getDataElementsByDataSetId = (metadata, dataSetId) => {
    const dataElements = getDataSetById(dataSetId).dataSetElements.map((dse) =>
        getDataElementById(dse.id)
    )
    return dataElements
}

const getCategoryCombosByDataElements = (metadata, dataElements) => {
    const categoryCombos = dataElements.reduce((ccs, de) => {
        const cc = de.categoryCombo
        if (!ccs[cc.id]) {
            ccs[cc.id] = cc
        }
        return cc
    }, {})
    return categoryCombos
}

const getCategoryCombosByDataSetId = (metadata, dataSetId) => {
    const dataElements = getDataElementsByDataSetId(metadata, dataSetId)
    return getCategoryCombosByDataElements(dataElements)
}

const getCategoryById = (metadata, id) => {
    return getCategories(metadata)[id]
}

const getCategoryComboById = (metadata, id) => {
    return getCategoryCombos(metadata)[id]
}

const getCategoryOptionById = (metadata, id) => {
    return getCategoryOptions(metadata)[id]
}

const getCategoryOptionComboById = (metadata, id) => {
    return getCategoryOptionCombos(metadata)[id]
}

const getCategoriesByCategoryComboId = (metadata, categoryComboId) => {
    const categoryCombo = getCategoryComboById(categoryComboId)
    const categories = categoryCombo.categories.map((id) =>
        getCategoryById(metadata, id)
    )
    return categories
}

const getCategoryOptionsByCategoryId = (metadata, categoryId) => {
    const category = getCategoryById(categoryId)
    const categoryOptions = category.categoryOptions.map((optId) =>
        getCategoryOptionById(optId)
    )
    return categoryOptions
}

const getCategoryOptionCombosByCategoryComboId = (metadata, catComboId) => {
    const categoryCombo = getCategoryComboById(catComboId)
    const categoryOptionCombos = categoryCombo.categoryOptionCombos.map((cocId) =>
        getCategoryOptionComboById(cocId)
    )
    return categoryOptionCombos
}

// Birk: catCombo => catOptsCombos => categories => catOpts
// Kai: catCombo => cats => catOpts => catOptsCombos
//                    v=> catOptsCombos
// catCombo => categories
// catCombo => catOptsCombos

// catCombo.categories.forEach
//      -- cat.label
// cat.catOpts.forEach
//   //
const getDataSetMetadata = (metadata, dataSetId) => {
    const dataElements = getDataElementsByDataSetId(metadata, dataSetId)

    const sections = getSectionsByDataSetId(metadata, dataSetId)

    // const
}

// getting data elements:
// 1. get all data set elements (all form types)
// 2. if it's a section form, then organize by section

/// data
