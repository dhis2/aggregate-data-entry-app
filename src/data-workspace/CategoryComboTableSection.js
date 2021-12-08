import {
    Table,
    TableRowHead,
    TableHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'

export const CategoryComboTableSection = ({ matrix }) => {
    return (
        <Table>
            <TableHead>
                {/* Will need to handle multiple-category combos with multiple header rows */}
                {/* TODO: should be category name */}
                {matrix.categoryCombo.map(({ name, options }) => {
                    return (
                        <TableRowHead>
                            {options.map((o) => (
                                <TableCellHead>{o}</TableCellHead>
                            ))}
                        </TableRowHead>
                    )
                })}
                <TableCellHead />
            </TableHead>
            <TableBody>
                {/* For each data element, render a row */}
                {matrix.dataElements.map((de) => {
                    return (
                        <TableRow key={de.id}>
                            <TableCellHead>{de.formName}</TableCellHead>
                            {exampleCC.categoryOptionCombos.map((coc) => (
                                <TableCell key={coc.id}>
                                    {getDataValue(de.id, coc.id)}
                                </TableCell>
                            ))}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
