import { periodTypes as periodTypesOrig } from '@dhis2/multi-calendar-dates'

const periodTypes = Object.fromEntries(
    periodTypesOrig.map((periodType) => [periodType, periodType])
)

export default periodTypes
