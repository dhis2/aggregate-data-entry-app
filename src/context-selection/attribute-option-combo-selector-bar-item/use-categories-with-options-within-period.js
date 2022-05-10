import { selectors, useMetadata } from '../../metadata/index.js'
import { parsePeriodId } from '../../shared/index.js'
import { useDataSetId, usePeriodId } from '../use-context-selection/index.js'

const isOptionWithinPeriod = ({
    periodStartDate,
    periodEndDate,
    categoryOption,
}) => {
    // option has not start and end dates
    if (!categoryOption.startDate && !categoryOption.endDate) {
        return true
    }

    if (categoryOption.startDate) {
        const startDate = new Date(categoryOption.startDate)
        if (periodStartDate < startDate) {
            // option start date is after period start date
            return false
        }
    }

    if (categoryOption.endDate) {
        const endDate = new Date(categoryOption.endDate)
        if (periodEndDate > endDate) {
            // option end date is before period end date
            return false
        }
    }

    // option spans over entire period
    return true
}

const resolveCategoryOptionIds = (categories, categoryOptions) => {
    return categories.map((category) => ({
        ...category,
        categoryOptions: category.categoryOptions.map(
            (id) => categoryOptions[id]
        ),
    }))
}

export default function useCategoriesWithOptionsWithinPeriod() {
    const { data: metadata } = useMetadata()
    const [periodId] = usePeriodId()
    const [dataSetId] = useDataSetId()

    if (!dataSetId || !periodId) {
        return []
    }

    const relevantCategories = selectors.getCategoriesByDataSetId(metadata, dataSetId)
    const categoryOptions = selectors.getCategoryOptions(metadata)
    const relevantCategoriesWithOptions = resolveCategoryOptionIds(
        relevantCategories,
        categoryOptions
    )
    const period = parsePeriodId(periodId)
    const periodStartDate = new Date(period.startDate)
    const periodEndDate = new Date(period.endDate)

    return relevantCategoriesWithOptions.map((category) => ({
        ...category,
        categoryOptions: category.categoryOptions.filter((categoryOption) =>
            isOptionWithinPeriod({
                periodStartDate,
                periodEndDate,
                categoryOption,
            })
        ),
    }))
}
