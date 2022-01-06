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
import React, { useEffect } from 'react'
import styles from './data-table.module.css'
import {
    getDataSetById,
    getDataElementsByDataSetId,
    getCategoryCombosByDataElements,
    getCategoryOptionCombosByCategoryComboId,
    getSortedCategoryOptionCombosByCategoryComboId,
    getCategoriesByCategoryComboId,
    getCategoryOptionsByCoCId,
    getCategoryOptionsByCategoryId,
    getCoCByCategoryOptions,
    groupDataElementsByCatCombo,
} from './selectors.js'
import { cartesian } from './utils.js'

console.log('stylez', styles)
const query = {
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

export const DataTable = ({
    metadata,
    dataSetId,
    period,
    orgUnitId,
    attributeOptionCombo,
    filterText,
}) => {
    if (!metadata) {
        return 'Loading'
    }
    // dataSetId = 'y3PUl2zXH8o' //test triple cat
    const dataSet = getDataSetById(metadata, dataSetId)
    console.log({ dataSet })
    const { data, loading, refetch } = useDataQuery(query, {
        variables: {
            dataSetId,
            orgUnitId,
            period,
            attributeOptionCombo,
        },
    })

    useEffect(() => {
        refetch({
            variables: { dataSetId, orgUnitId, period, attributeOptionCombo },
        })
    }, [dataSetId, orgUnitId, period, attributeOptionCombo])

    const dataElements = getDataElementsByDataSetId(metadata, dataSetId)
    console.log({ dataElements })
    const catCombos = getCategoryCombosByDataElements(metadata, dataElements)
    if (catCombos.length > 1) {
        const grouped = groupDataElementsByCatCombo(metadata, dataElements)
    }
    const catcombo = catCombos[0]
    console.log({ catcombo })

    const categories = getCategoriesByCategoryComboId(metadata, catcombo.id)
    const catoptcombos = getCategoryOptionCombosByCategoryComboId(
        metadata,
        catcombo.id
    )
    const optionsIdLists = categories.map((cat) => cat.categoryOptions)

    console.log(
        'total options',
        optionsIdLists.flatMap((c) => c)
    )
    console.log({ optionsLists: optionsIdLists })
    const catOptionsOrder = cartesian(optionsIdLists) // combination of category-options for a particular column

    console.log({ categories })
    console.log({ catoptcombos })

    console.log({ catOptionsOrder })

    // colSpan current category
    let catColSpan = catOptionsOrder.length

    // Calculate number of times we need to repeat the options per category
    const catRenderInfo = categories.reduce((acc, cat) => {
        const nrOfOptions = cat.categoryOptions.length
        if (nrOfOptions > 0 && catColSpan >= nrOfOptions) {
            catColSpan = catColSpan / nrOfOptions
            const total = catOptionsOrder.length / (catColSpan * nrOfOptions)
            //console.log('category', cat, ' repeat', total, 'span', catColSpan)
            acc[cat.id] = {
                span: catColSpan,
                repeat: total,
            }
        }
        return acc
    }, {})
    console.log({ catOptRepeat: catRenderInfo })

    const columnsToRender = categories.map((c) => {
        const categoryOptions = getCategoryOptionsByCategoryId(metadata, c.id)
        const renderInfo = catRenderInfo[c.id]
        const columnsToRender = new Array(renderInfo.repeat)
            .fill(0)
            .flatMap(() => categoryOptions)
        //columns.push(columnsToRender)
        //optionsMatrix.push(categoryOptions)
        return {
            ...catRenderInfo[c.id],
            columns: columnsToRender,
            categoryOptions,
            category: c,
        }
    })

    // const options = columnsToRender.map((col) =>
    //     col.categoryOptions.map((co) => co.id)
    // )
    //   const catOptionsOrder = cartesian(options) // combination of category-options for a particular column
    //columnsToRender.forEach((val, i))

    const sortedCOCs = catOptionsOrder
        .map((options) =>
            getCoCByCategoryOptions(metadata, catcombo.id, options)
        )
        .filter((coc) => !!coc)

    const getDataValue = (dataElementId, cocId) => {
        const values = data?.dataValues?.dataValues
        if (!values) {
            return null
        }

        const ret = values.find(
            (v) =>
                v.categoryOptionCombo === cocId &&
                v.dataElement === dataElementId
        )
        return ret
    }
    return (
        <Table>
            <TableHead>
                {columnsToRender.map((colInfo) => {
                    const { span, columns } = colInfo
                    return (
                        <TableRowHead key={colInfo.category.id}>
                            <TableCellHead
                                className={styles.categoryNameHeader}
                                colSpan={'1'}
                            >
                                {colInfo.category.displayFormName}
                            </TableCellHead>
                            {columns.map((co, i) => {
                                //console.log({ cocOptions })
                                return (
                                    <TableCellHead
                                        key={i}
                                        className={
                                            span === 1
                                                ? styles.tableHeaderLastCategory
                                                : styles.tableHeader
                                        }
                                        colSpan={span.toString()}
                                    >
                                        {co.displayFormName}
                                    </TableCellHead>
                                )
                            })}
                        </TableRowHead>
                    )
                })}
            </TableHead>
            <TableBody>
                {dataElements
                    .filter((de) => de.displayFormName.contains(filterText))
                    .map((de) => {
                        console.log(
                            'filterz',
                            de.displayFormName,
                            de.displayFormName.contains(filterText)
                        )
                        return (
                            <TableRow key={de.id}>
                                <TableCell className={styles.tableCell}>
                                    <div style={{ minWidth: 150 }}>
                                        {de.displayFormName}
                                    </div>
                                </TableCell>
                                {sortedCOCs.map((coc) => (
                                    <TableCell
                                        key={coc.id}
                                        className={styles.tableCell}
                                    >
                                        <span>
                                            {getDataValue(de.id, coc.id)?.value}
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    })}
            </TableBody>
        </Table>
    )
}

const TableSection = ({}) => {
    return
}
