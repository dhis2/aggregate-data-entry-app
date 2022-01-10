import { useAttributeOptionComboSelection } from '../use-context-selection/index.js'

export default function useSelectedCategoryOptionByCategoryId(id) {
    const [categoryOptionIds] = useAttributeOptionComboSelection()
    const selectedValue =
        categoryOptionIds.find((curId) => curId.startsWith(`${id}:`)) || ''
    const [, categoryOptionId] = selectedValue.split(':')
    return categoryOptionId
}
