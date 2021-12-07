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

    return (
        <Table>
            <TableHead>
                {categories.map((c) => (
                    <TableRowHead>
                        {catoptcombos.map((coc) => {
                            const cocOptions = getCategoryOptionsByCoCId(
                                metadata,
                                coc.id
                            )
                            //console.log({ cocOptions })
                            return (
                                <TableCellHead>
                                    {cocOptions[0].displayFormName}
                                </TableCellHead>
                            )
                        })}
                    </TableRowHead>
                ))}
            </TableHead>
        </Table>
    )
}
