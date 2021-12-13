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
} from './selectors'

export const DataTable = ({ metadata, dataSetId }) => {
    if (!metadata) {
        return 'Loading'
    }
    dataSetId = 'y3PUl2zXH8o' //test triple cat
    const dataSet = getDataSetById(metadata, dataSetId)
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

    const colRepeat = categories.reduce((acc, cat) => {
        const nrOfOptions = cat.categoryOptions.length

        if (nrOfOptions > 0 && catColSpan >= nrOfOptions) {
            catColSpan = catColSpan / nrOfOptions
            const total = catoptcombos.length / (catColSpan * nrOfOptions)
            acc[cat.id] = total
        }
        return acc
    }, {})
    console.log(colRepeat)
    return (
        <Table>
            <TableHead>
                {categories.map((c) => {
                    //const totalColumns =
                    return (
                        <TableRowHead>
                            {catoptcombos.map((coc) => {
                                const cocOptions = getCategoryOptionsByCoCId(
                                    metadata,
                                    coc.id
                                )
                                //console.log({ cocOptions })
                                return (
                                    <TableCellHead colSpan={1}>
                                        {cocOptions[0].displayFormName}
                                    </TableCellHead>
                                )
                            })}
                        </TableRowHead>
                    )
                })}
            </TableHead>
        </Table>
    )
}
