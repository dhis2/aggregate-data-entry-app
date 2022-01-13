import {
    Table,
    TableRowHead,
    TableHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
    SingleSelect,
    SingleSelectOption,
    SingleSelectField,
} from '@dhis2/ui'
import React from 'react'
import { useQuery } from 'react-query'

const ngeleId = 'DiszpKrYNg8'
const pe = '202108'

const query = {
    dataSet: {
        resource: 'dataSets',
        params: {
            fields: 'id, displayName',
        },
    },
}

export const DataSetSelector = ({ onDataSetSelect, selected }) => {
    const { isLoading, data } = useQuery([query])

    return (
        <SingleSelectField
            label="Select Dataset"
            onChange={onDataSetSelect}
            loading={isLoading}
            selected={data && selected}
        >
            {data?.dataSet?.dataSets.map((ds) => (
                <SingleSelectOption
                    key={ds.id}
                    label={ds.displayName}
                    value={ds.id}
                />
            ))}
        </SingleSelectField>
    )
}
