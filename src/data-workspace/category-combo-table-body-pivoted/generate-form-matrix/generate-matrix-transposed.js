import i18n from '@dhis2/d2-i18n'
import { selectors } from '../../../shared/index.js'

export const generateMatrixTransposed = (options) => {
    const {
        metadata,
        categoryOptionsDetails,
        sortedCOCs,
        categories,
        dataElements,
    } = options

    const columnHeaderFields = [...categories, ...dataElements]

    const columnHeaders = [
        [
            ...columnHeaderFields.map((header) => {
                return {
                    id: header?.id,
                    name: header.name,
                    displayFormName: header?.displayFormName,
                    type: 'columnHeader',
                    metadataType: header.valueType ? 'dataElement' : 'category',
                }
            }),
        ],
    ]

    const rowHeaders = []

    const alreadyAdded = {}
    sortedCOCs.forEach((categoryOptionCombo) => {
        const dataEntryRow = []

        categoryOptionCombo.categoryOptions.forEach((fco) => {
            const categoryOption = categoryOptionsDetails.find(
                (cod) => cod.id === fco
            )
            const categoryIndex = categories.findIndex((cat) =>
                cat.categoryOptions.includes(fco)
            )

            // todo(pivot): maybe refactor this logic after confirming this is Functional Design team wants UI-wise
            const lastCateogry = categoryIndex === categories.length - 1
            if (!alreadyAdded[categoryOption.id] || lastCateogry) {
                dataEntryRow.push({
                    id: categoryOption?.id,
                    displayFormName:
                        categoryOption?.name === 'default'
                            ? i18n.t('Value')
                            : categoryOption?.displayName,
                    rowSpan:
                        categories.length === 1
                            ? 1
                            : sortedCOCs.length /
                              categories.length /
                              (categoryIndex + 1),
                    type: 'rowHeader',
                })
                alreadyAdded[categoryOption.id] = true
            }
        })

        dataElements.forEach((de) => {
            const dataElement = selectors.getDataElementById(metadata, de.id)
            dataEntryRow.push({
                id: de.id,
                displayName: de.displayName,
                rowSpan: 1,
                type: 'de',
                dataElement,
                coc: selectors
                    .getCategoryOptionCombosByCategoryComboId(
                        metadata,
                        dataElement.categoryCombo.id
                    )
                    .find((coc) => coc.id === categoryOptionCombo.id),
            })
        })
        rowHeaders.push(dataEntryRow)
    })

    return { columnHeaders, rowHeaders }
}
