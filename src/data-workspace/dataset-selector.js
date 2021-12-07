import React from 'react'
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
import { useDataQuery } from '@dhis2/app-runtime'

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
    const { loading, data, error } = useDataQuery(query)

    return (
        <SingleSelectField
            label="Select Dataset"
            onChange={onDataSetSelect}
            loading={loading}
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
