export const getFieldId = (de, coc) => {
    return `${de.id}.${coc.id}`
}

export const getFieldIdComponents = (fieldId) => {
    if (!fieldId) {
        return {
            dataElementId: null,
            categoryOptionComboId: null,
        }
    }

    const [dataElementId, categoryOptionComboId] = fieldId.split('.')

    return {
        dataElementId,
        categoryOptionComboId,
    }
}
