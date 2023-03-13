// @TODO: export the groups from the multi-calendar-dates library
import { periodTypes } from '@dhis2/multi-calendar-dates'

export const yearlyFixedPeriodTypes = periodTypes.filter((periodType) =>
    periodType.match(/^(YEARLY|FY[A-Z]{3})/)
)
