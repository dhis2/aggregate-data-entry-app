import { useQuery } from 'react-query'
import { hashArraysInObject } from './utils.js'

export const useMetadata = () => {
    const queryKey = [
        'metadata',
        {
            params: {
                // Note: on dataSet.dataSetElement, the categoryCombo property is
                // included because it can mean it's overriding the data element's
                // native categoryCombo. It can sometimes be absent from the data
                // set element
                'dataSets:fields':
                    'id,displayFormName,formType,dataSetElements[dataElement,categoryCombo],categoryCombo,sections~pluck',
                'dataElements:fields':
                    'id,displayFormName,categoryCombo,valueType',
                'sections:fields':
                    'id,displayName,sortOrder,showRowTotals,showColumnTotals,disableDataElementAutoGroup,greyedFields[id],categoryCombos~pluck,dataElements~pluck,indicators~pluck',
                'categoryCombos:fields':
                    'id,skipTotal,categories~pluck,categoryOptionCombos~pluck,isDefault',
                'categories:fields': 'id,displayFormName,categoryOptions~pluck',
                'categoryOptions:fields':
                    'id,displayFormName,categoryOptionCombos~pluck,categoryOptionGroups~pluck,isDefault',
                'categoryOptionCombos:fields':
                    'id,categoryOptions~pluck,categoryCombo,name',
            },
        },
    ]

    return useQuery(queryKey, {
        select: (data) => hashArraysInObject(data),
    })
}