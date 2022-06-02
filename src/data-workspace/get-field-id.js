export const getFieldId = (de, coc) => {
    return `${de.id}.${coc.id}`
}

export const getFieldIdComponents = (fieldId) => {
    const [dataElement, categoryOptionCombo] = fieldId.split('.')

    return {
        dataElement,
        categoryOptionCombo,
    }
}
