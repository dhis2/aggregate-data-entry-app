import { StringParam, useQueryParam } from 'use-query-params'

export function useFeature(feature) {
    const [allFeatures] = useQueryParam('features', StringParam)
    const features = allFeatures?.split(',')

    return !!features?.includes(feature)
}
