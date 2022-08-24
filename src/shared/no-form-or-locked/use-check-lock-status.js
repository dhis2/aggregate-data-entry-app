import { useEffect } from 'react'
import { getCurrentDate, parsePeriodId } from '../fixed-periods/index.js'
import { useMetadata, selectors } from '../metadata/index.js'
import {
    usePeriodId,
    useDataSetId,
    useOrgUnitId,
} from '../use-context-selection/use-context-selection.js'
import { noFormOrLockedStates } from './no-form-and-locked-states.js'
import { useNoFormOrLockedContext } from './use-no-form-or-locked-context.js'

export const useCheckLockStatus = () => {
    const [dataSetId] = useDataSetId()
    const [orgUnitId] = useOrgUnitId()
    const [periodId] = usePeriodId()
    const { data: metadata } = useMetadata()
    const { setNoFormOrLockedStatus } = useNoFormOrLockedContext()

    useEffect(() => {
        const now = getCurrentDate()

        if (dataSetId && periodId) {
            const dataInputPeriod = selectors.getApplicableDataInputPeriod(
                metadata,
                dataSetId,
                periodId
            )

            if (dataInputPeriod) {
                const openingDate = new Date(dataInputPeriod.openingDate)
                const closingDate = new Date(dataInputPeriod.closingDate)

                if (openingDate > now || closingDate < now) {
                    // mark as invalid for data input period
                    setNoFormOrLockedStatus(
                        noFormOrLockedStates.DATA_INPUT_PERIOD_OUT_OF_RANGE(
                            dataInputPeriod
                        )
                    )
                    return
                }
            }
        }

        // check expiryDays
        if (dataSetId && periodId && orgUnitId) {
            const expiryDays = selectors.getExpiryDays(metadata, dataSetId)
            // const lockExceptions

            // ignore if there's a lock exception

            // expiryDays is set to 0 by default, so a value must be specfied for locking to occur
            if (expiryDays > 0) {
                const period = parsePeriodId(periodId)
                const endDate = new Date(period.endDate)
                endDate.setDate(endDate.getDate() + expiryDays)

                if (now > endDate) {
                    setNoFormOrLockedStatus(noFormOrLockedStates.EXPIRY_DAYS)
                    return
                }
            }
        }

        // if no violations found, set form to open
        setNoFormOrLockedStatus(noFormOrLockedStates.OPEN)
    }, [metadata, dataSetId, orgUnitId, periodId, setNoFormOrLockedStatus])
}
