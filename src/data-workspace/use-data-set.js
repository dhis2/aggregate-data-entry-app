import { useQuery } from 'react-query'
import { useContextSelection } from '../context-selection/index.js'

export const useDataSet = () => {
    const [{ dataSetId }] = useContextSelection()

    return useQuery([
        'dataSets',
        {
            id: dataSetId,
            params: {
                fields: `id,name,displayName,displayFormName,formType,renderAsTabs,renderHorizontally,
            dataSetElements[dataElement[id,name,formName,
            categoryCombo[id,name,categories[id,displayName,categoryOptions[id,displayName]],categoryOptionCombos[id,name]]]],
            sections[:owner,displayName,categoryCombos[id,categories[id,displayName,categoryOptions[id,displayName]]]]`,
            },
        },
    ])
}
