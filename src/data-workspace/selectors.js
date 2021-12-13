import { cartesian } from './utils'

export const getDataElements = (metadata) => metadata.dataElements

export const getDataElementById = (metadata, id) =>
    getDataElements(metadata)[id]

export const getCategories = (metadata) => metadata.categories

export const getCategoryCombos = (metadata) => metadata.categoryCombos

export const getCategoryOptions = (metadata) => metadata.categoryOptions

export const getCategoryOptionCombos = (metadata) =>
    metadata.categoryOptionCombos

export const getDataSets = (metadata) => metadata.dataSets
export const getDataSetById = (metadata, dataSetId) =>
    getDataSets(metadata)?.[dataSetId]

export const getSections = (metadata) => metadata.sections

export const getSectionsByDataSetId = (metadata, dataSetId) => {
    const sections = getSections(metadata)
    const dataSet = getDataSetById(metadata, dataSetId)

    return dataSet.sections.map((sId) => sections[sId])
}

export const getDataElementsByDataSetId = (metadata, dataSetId) => {
    const dataElements = getDataSetById(
        metadata,
        dataSetId
    )?.dataSetElements?.map((dse) => {
        const dataElement = getDataElementById(metadata, dse.dataElement.id)
        // catcombo for a dataelement can be overriden per dataSet
        // in that case, dataSetElement.categoryCombo takes precedence
        const dataElementCategoryCombo =
            dse.categoryCombo ?? dataElement.categoryCombo
        return {
            ...dataElement,
            categoryCombo: dataElementCategoryCombo,
        }
    })

    return dataElements
}

// Use IDs?
// Most of the time, this should return only one catcombo
// (Maybe don't need it if we use data element order from backend)
export const getCategoryCombosByDataElements = (metadata, dataElements) => {
    const categoryCombos = dataElements.reduce((ccs, de) => {
        const cc = de.categoryCombo
        if (!ccs[cc.id]) {
            ccs[cc.id] = getCategoryComboById(metadata, cc.id)
        }
        return cc
    }, {})
    return categoryCombos
}

export const getCategoryCombosByDataSetId = (metadata, dataSetId) => {
    const dataElements = getDataElementsByDataSetId(metadata, dataSetId)
    return getCategoryCombosByDataElements(dataElements)
}

export const getCategoryById = (metadata, id) => {
    return getCategories(metadata)[id]
}

export const getCategoryComboById = (metadata, id) => {
    return getCategoryCombos(metadata)[id]
}

export const getCategoryOptionById = (metadata, id) => {
    return getCategoryOptions(metadata)[id]
}

export const getCategoryOptionsByCoCId = (metadata, cocId) => {
    const coc = getCategoryOptionComboById(metadata, cocId)
    return coc.categoryOptions.map((coId) =>
        getCategoryOptionById(metadata, coId)
    )
}

export const getCategoryOptionComboById = (metadata, id) => {
    return getCategoryOptionCombos(metadata)[id]
}

export const getCategoriesByCategoryComboId = (metadata, categoryComboId) => {
    const categoryCombo = getCategoryComboById(metadata, categoryComboId)
    const categories = categoryCombo.categories.map((id) =>
        getCategoryById(metadata, id)
    )
    return categories
}

export const getCategoryOptionsByCategoryId = (metadata, categoryId) => {
    const category = getCategoryById(metadata, categoryId)
    const categoryOptions = category.categoryOptions.map((optId) =>
        getCategoryOptionById(metadata, optId)
    )
    return categoryOptions
}

export const getCategoryOptionCombosByCategoryComboId = (
    metadata,
    catComboId
) => {
    const categoryCombo = getCategoryComboById(metadata, catComboId)
    console.log({ categoryCombo })
    const categoryOptionCombos = categoryCombo?.categoryOptionCombos.map(
        (cocId) => getCategoryOptionComboById(metadata, cocId)
    )
    return categoryOptionCombos
}

/**
 * Gets the correct ordering of categoryOptionCombos within a category combination
 * @param {*} metadata
 * @param {*} catComboId
 * @returns
 */
export const getSortedCategoryOptionCombosByCategoryComboId = (
    metadata,
    catComboId
) => {
    const categories = getCategoriesByCategoryComboId(metadata, catComboId)

    // get options for each category, these should be in sorted order
    const allOptionsLists = categories.map((cat) => cat.categoryOptions)
    // compute the  combination of category-catgoryOption- this basically computes all the categoryCombinations
    // result is a matrix of categoryOptions for each column in the categoryCombo
    const optionCombinationOrder = cartesian(allOptionsLists)
    return optionCombinationOrder.map((opts) =>
        getCoCByCategoryOptions(metadata, catComboId, opts)
    )
}

/**
 * Tries to find the categoryOptionCombo with the given categoryOptions within
 * a category combination.
 * @param {} metadata
 * @param {*} catComboId
 * @param {*} categoryOptionIds
 * @returns
 */
export const getCoCByCategoryOptions = (
    metadata,
    catComboId,
    categoryOptionIds
) => {
    const cocs = getCategoryOptionCombosByCategoryComboId(metadata, catComboId)
    const sorted = [...categoryOptionIds].sort() //sort to check for equality

    for (const coc of cocs) {
        const sortedCatOptions = [...coc.categoryOptions].sort()
        if (
            sorted.length === sortedCatOptions.length &&
            sortedCatOptions.every((id, ind) => id === sorted[ind])
        ) {
            return coc
        }
    }
    console.warn(
        `Could not find categoryOptionCombo for catCombo ${catComboId}, with categoryOptions: ${categoryOptionIds.join()}`
    )
    return null
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
export const getDataSetMetadata = (metadata, dataSetId) => {
    const dataElements = getDataElementsByDataSetId(metadata, dataSetId)

    const sections = getSectionsByDataSetId(metadata, dataSetId)

    // const
}

// getting data elements:
// 1. get all data set elements (all form types)
// 2. if it's a section form, then organize by section

/// data
