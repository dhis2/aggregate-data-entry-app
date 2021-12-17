import getMostRecentCompletedYear from './get-most-recent-completed-year.js'

export default function computeMaxYear(periodType) {
    return periodType ? getMostRecentCompletedYear(periodType) : null
}
