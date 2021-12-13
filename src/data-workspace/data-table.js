import React from 'react'
import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
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
} from './selectors'
import { useDataQuery } from '@dhis2/app-runtime'
import { cartesian } from './utils'
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
}) => {
    if (!metadata) {
        return 'Loading'
    }
    // dataSetId = 'y3PUl2zXH8o' //test triple cat
    const dataSet = getDataSetById(metadata, dataSetId)
    console.log({ dataSet })
    const { data, loading } = useDataQuery(query, {
        variables: {
            dataSetId,
            orgUnitId,
            period,
            attributeOptionCombo,
        },
    })

    const dataElements = getDataElementsByDataSetId(metadata, dataSetId)
    console.log({ dataElements })
    const catcombo = getCategoryCombosByDataElements(metadata, dataElements)
    console.log({ catcombo })

    const categories = getCategoriesByCategoryComboId(metadata, catcombo.id)
    const catoptcombos = getCategoryOptionCombosByCategoryComboId(
        metadata,
        catcombo.id
    )
    console.log({ categories })
    console.log({ catoptcombos })

    let catColSpan = catoptcombos.length

    // Calculate number of times we need to repeat the options per category
    const catOptRepeat = categories.reduce((acc, cat) => {
        const nrOfOptions = cat.categoryOptions.length

        if (nrOfOptions > 0 && catColSpan >= nrOfOptions) {
            catColSpan = catColSpan / nrOfOptions
            const total = catoptcombos.length / (catColSpan * nrOfOptions)
            console.log('category', cat, ' repeat', total, 'span', catColSpan)
            acc[cat.id] = {
                span: catColSpan,
                repeat: total,
            }
        }
        return acc
    }, {})

    const columnsToRender = categories.map((c) => {
        const categoryOptions = getCategoryOptionsByCategoryId(metadata, c.id)
        const columnsToRender = new Array(catOptRepeat[c.id].repeat)
            .fill(0)
            .flatMap(() => categoryOptions)
        //columns.push(columnsToRender)
        //optionsMatrix.push(categoryOptions)
        return {
            ...catOptRepeat[c.id],
            columns: columnsToRender,
            categoryOptions,
        }
    })

    const options = columnsToRender.map((col) =>
        col.categoryOptions.map((co) => co.id)
    )
    const optionsOrder = cartesian(options) // combination of category-options for a particular column
    //columnsToRender.forEach((val, i))

    const sortedCatCombos = optionsOrder.map((options) =>
        getCoCByCategoryOptions(metadata, catcombo.id, options)
    )
    console.log(
        'sortz',
        getSortedCategoryOptionCombosByCategoryComboId(metadata, catcombo.id)
    )
    // columns.reduce((acc, curr, i) => {}, [])

    const getDataValue = (dataElementId, cocId) => {
        const values = data?.dataValues?.dataValues
        if (!values) {
            return null
        }

        const ret = values.find(
            (v) =>
                v.attributeOptionCombo === attributeOptionCombo &&
                v.categoryOptionCombo === cocId &&
                v.orgUnit === orgUnitId &&
                v.period === period &&
                v.dataElement === dataElementId
        )
        console.log(dataElementId, cocId, 'dataValues', values, ret)
        return ret
    }

    return (
        <Table>
            <TableHead>
                {columnsToRender.map((colInfo) => {
                    const { span, columns } = colInfo
                    return (
                        <TableRowHead>
                            <TableCellHead colSpan={1}></TableCellHead>
                            {columns.map((co) => {
                                //console.log({ cocOptions })
                                return (
                                    <TableCellHead colSpan={span}>
                                        {co.displayFormName}
                                    </TableCellHead>
                                )
                            })}
                        </TableRowHead>
                    )
                })}
            </TableHead>
            <TableBody>
                {dataElements.map((de) => {
                    return (
                        <TableRow>
                            <TableCell>
                                <div style={{ minWidth: 150 }}>
                                    {de.displayFormName}
                                </div>
                            </TableCell>
                            {sortedCatCombos.map((coc) => (
                                <TableCell>
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
