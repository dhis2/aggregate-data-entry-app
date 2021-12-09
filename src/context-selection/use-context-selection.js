import { StringParam, useQueryParams } from 'use-query-params'
import * as constants from './contants.js'

export const PARAMS_SCHEMA = {
    [constants.PARAM_DATA_SET_ID]: StringParam,
    [constants.PARAM_ORG_UNIT_ID]: StringParam,
    [constants.PARAM_PERIOD]: StringParam,
    [constants.PARAM_IMPLEMENTING_PARTNER_ID]: StringParam,
    [constants.PARAM_PROJECT_ID]: StringParam,
    [constants.PARAM_SECTION_FILTER]: StringParam,
}

export function useContextSelection() {
    return useQueryParams(PARAMS_SCHEMA)
}
