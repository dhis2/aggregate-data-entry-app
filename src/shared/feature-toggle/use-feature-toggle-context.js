import { useContext } from 'react'
import { FeatureToggleContext } from './feature-toggle-context.js'

export function useFeatureToggleContext() {
    return useContext(FeatureToggleContext)
}
