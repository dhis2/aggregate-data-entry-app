import { cartesian } from '../shared/utils.js'

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

export const getDataElementsBySection = (metadata, dataSetId, sectionId) => {
    const section = getSections(metadata)[sectionId]
    // need dataSetId to get dataElements from the dataSet, as there can be catCombo overrides
    const dataSetElements = getDataElementsByDataSetId(metadata, dataSetId)

    return section.dataElements.map((deId) =>
        dataSetElements.find((dse) => dse.id === deId)
    )
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
        return ccs
    }, {})

    return Object.values(categoryCombos)
}

export const groupDataElementsByCatComboInOrder = (metadata, dataElements) => {
    // gather elements in order
    // if catCombo is not the same as previous catCombo, it's grouped to a different catCombo

    // eslint-disable-next-line max-params
    return dataElements.reduce((acc, curr, ind, arr) => {
        const prevDE = arr[ind - 1]
        const prevGroup = acc[acc.length - 1]

        if (
            !prevGroup ||
            (prevDE && prevDE.categoryCombo.id != curr.categoryCombo.id)
        ) {
            acc.push({
                dataElements: [curr],
                categoryCombo: getCategoryComboById(
                    metadata,
                    curr.categoryCombo.id
                ),
            })
        } else {
            acc[acc.length - 1].dataElements.push(curr)
        }
        return acc
    }, [])
}

export const groupDataElementsByCatCombo = (metadata, dataElements) => {
    const categoryCombos = dataElements.reduce((ccs, de) => {
        const cc = de.categoryCombo
        if (!ccs[cc.id]) {
            const catCombo = getCategoryComboById(metadata, cc.id)

            ccs[cc.id] = {
                categoryCombo: catCombo,
                dataElements: [de],
            }
        } else {
            ccs[cc.id].dataElements.push(de)
        }
        return ccs
    }, {})
    return Object.values(categoryCombos)
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
    // compute the  combination of category-catgoryOption- this basically computes the categoryCombinations
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
