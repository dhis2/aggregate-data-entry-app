import {
    getContextSelectionId,
    parseContextSelectionId,
} from '../use-context-selection/use-context-selection.js'

export const getCellId = ({
    contextSelectionId,
    item: { categoryOptionCombo, dataElement },
}) => `${contextSelectionId}_${dataElement}_${categoryOptionCombo}`

export const parseCellId = (cellId) => {
    const [contextSelectionId, dataElement, categoryOptionCombo] =
        cellId.split('_')
    const parsedContextSelectionId = parseContextSelectionId(contextSelectionId)

    return {
        ...parsedContextSelectionId,
        dataElement,
        categoryOptionCombo,
    }
}

export const getCellIdFromDataValueParams = (params) => {
    if (!params) {
        return null
    }
    const contextSelectionId = getContextSelectionId({
        attributeOptions: params.cp?.split(';'),
        dataSetId: params.ds,
        orgUnitId: params.ou,
        periodId: params.pe,
    })

    return getCellId({
        contextSelectionId,
        item: { categoryOptionCombo: params.co, dataElement: params.de },
    })
}

export const getCellIdFromMutationKey = (mutationKey) =>
    getCellIdFromDataValueParams(mutationKey[1].params)
