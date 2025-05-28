import { selectors } from '../../../shared/index.js'

export const generateMatrixGroupedByCategory = (options, groupedBy) => {
    const columnHeaders = generateColumnHeaders(options, groupedBy)

    const rowHeaders = generateRowHeaders(options, groupedBy)
    return { columnHeaders, rowHeaders }
}

const generateHeaderMetadata = (metadata, categories, numberOfCoCs) => {
    let catColSpan = numberOfCoCs
    return categories.map((c) => {
        const categoryOptions = selectors.getCategoryOptionsByCategoryId(
            metadata,
            c.id
        )
        const nrOfOptions = c.categoryOptions.length
        // catColSpan should always be equal to nrOfOptions in last iteration
        // unless anomaly with categoryOptionCombo-generation server-side
        if (nrOfOptions > 0 && catColSpan >= nrOfOptions) {
            // calculate colSpan for current options
            // this is the span for each option, not the "total" span of the row
            catColSpan = catColSpan / nrOfOptions
            // when table have multiple categories, options need to be repeated for each disaggregation "above" current-category
            const repeat = numberOfCoCs / (catColSpan * nrOfOptions)

            const columnsToRender = new Array(repeat)
                .fill(0)
                .flatMap(() => categoryOptions)

            return {
                span: catColSpan,
                columns: columnsToRender,
                category: c,
                categoryOptions,
                repeat,
            }
        } else {
            console.warn(
                `Category ${c.displayFormName} malformed. Number of options: ${nrOfOptions}, span: ${catColSpan}`
            )
        }
        return c
    })
}

const generateRowHeaders = (options, groupedBy = []) => {
    const { sortedCOCs, categories, dataElements } = options

    const rowCategories = categories.filter((cat) => groupedBy.includes(cat.id))
    const totalCocsInRow = rowCategories.reduce(
        (acc, item) => acc * item.categoryOptions.length,
        1
    )
    // we only support one transposed category for now
    const [rowHeaderMetadata] = generateHeaderMetadata(
        options.metadata,
        rowCategories,
        totalCocsInRow
    )

    const rows = []
    const alreadyAdded = new Set()
    dataElements.forEach((de) => {
        rowHeaderMetadata.categoryOptions.forEach((rowCategoryOption) => {
            const dataEntryRow = []
            if (rows.length % totalCocsInRow === 0) {
                dataEntryRow.push({
                    id: de.id,
                    displayFormName: de.displayFormName,
                    type: 'rowHeader',
                    rowSpan: totalCocsInRow,
                    metadataType: 'dataElement',
                })
                alreadyAdded.add(de.id)
            }
            // add the category option - ie. the row header
            dataEntryRow.push({
                id: rowCategoryOption.id,
                displayFormName: rowCategoryOption.displayFormName,
                type: 'rowHeader',
                metadataType: 'categoryOption',
                span: rowHeaderMetadata.span,
            })

            // add relevant COCs to the row - ie. the data cells
            sortedCOCs
                .filter((coc) =>
                    coc.categoryOptions.includes(rowCategoryOption.id)
                )
                .forEach((coc) => {
                    dataEntryRow.push({
                        id: de.id + coc?.id,
                        type: 'de',
                        dataElement: de,
                        coc: coc,
                        metadataType: 'categoryOptionCombo',
                    })
                })

            rows.push(dataEntryRow)
        })
    })
    return rows
}

const generateColumnHeaders = (options, groupedBy) => {
    const { categories } = options

    const columnCategories = categories.filter(
        (cat) => !groupedBy.includes(cat.id)
    )

    const [transposedCategory] = categories.filter((cat) =>
        groupedBy.includes(cat.id)
    )
    const totalCocsWithoutGroupedCategory = columnCategories.reduce(
        (acc, cat) => acc * cat.categoryOptions.length,
        1
    )

    // generate header-metadata like span for  the regular "categories"
    // ie. each category that is not transposed to the row
    const columnHeaderMetadata = generateHeaderMetadata(
        options.metadata,
        columnCategories,
        totalCocsWithoutGroupedCategory
    )

    const columnHeaders = []

    const paddingCell = {
        id: -1 /** todo: unique id */,
        type: 'empty',
        colSpan: 1,
        // rowSpan: fullRowSpan,
    }
    // add the column headers (each category as a row)
    columnHeaderMetadata.forEach((header) => {
        const category = {
            id: header.category?.id,
            displayFormName: header.category?.displayFormName,
            type: 'columnHeader',
            metadataType: 'category',
            // colSpan: largestOptionsLength,
        }
        const categoryOptions = header.columns.map((co) => ({
            id: co.id,
            displayFormName: co.displayFormName,
            type: 'columnHeader',
            metadataType: 'categoryOption',
            colSpan: header.span,
        }))
        columnHeaders.push([paddingCell, category, ...categoryOptions])
    })

    // add the "transposed category" as the last row
    columnHeaders.push([
        {
            id: -1 /** todo: unique id */,
            type: 'empty',
            colSpan: 1,
        },
        {
            id: transposedCategory?.id,
            displayFormName: transposedCategory?.displayFormName,
            type: 'columnHeader',
            metadataType: 'category',
        },
        {
            id: -1 /** todo: unique id */,
            type: 'empty',
            colSpan: totalCocsWithoutGroupedCategory,
        },
    ])
    return columnHeaders
}
