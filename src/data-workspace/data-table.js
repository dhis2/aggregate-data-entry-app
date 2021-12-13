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
    getCategoriesByCategoryComboId,
    getCategoryOptionsByCoCId,
    getCategoryOptionsByCategoryId,
} from './selectors'
import { useDataQuery } from '@dhis2/app-runtime'

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
    dataSetId = 'y3PUl2zXH8o' //test triple cat
    const dataSet = getDataSetById(metadata, dataSetId)
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
    console.log(catoptcombos)

    //return 'Hello'
    let catColSpan = catoptcombos.length

    // Calculate number of times we need to repeat the options
    const optRepeat = categories.reduce((acc, cat) => {
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
    console.log(optRepeat)

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

        return ret
    }
    return (
        <Table>
            <TableHead>
                {categories.map((c) => {
                    const { span, repeat } = optRepeat[c.id]
                    const categoryOptions = getCategoryOptionsByCategoryId(
                        metadata,
                        c.id
                    )
                    const columnsToRender = new Array(repeat)
                        .fill(0)
                        .flatMap(() => categoryOptions)
                    //const totalColumns =
                    return (
                        <TableRowHead>
                            <TableCellHead colSpan={1}></TableCellHead>
                            {columnsToRender.map((co) => {
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
                            {catoptcombos.map((coc) => (
                                <TableCell>
                                    <input
                                        type="text"
                                        style={{ width: 64 }}
                                        value={
                                            getDataValue(de.id, coc.id)?.value
                                        }
                                    ></input>
                                </TableCell>
                            ))}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
