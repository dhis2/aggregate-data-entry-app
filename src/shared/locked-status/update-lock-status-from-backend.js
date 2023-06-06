import { LockedStates } from './locked-states.js'

export const updateLockStatusFromBackend = (
    frontEndLockStatus,
    backEndLockStatus,
    setLockStatus
) => {
    // if the lock status is APPROVED, set to approved
    if (backEndLockStatus === 'APPROVED') {
        setLockStatus(LockedStates.LOCKED_APPROVED)
        return
    }

    // if the lock status is LOCKED, this is locked due to expiry days
    if (backEndLockStatus === 'LOCKED') {
        setLockStatus(LockedStates.LOCKED_EXPIRY_DAYS)
        return
    }

    // a lock status of 'OPEN' from the backend could mean either that the form is open OR
    // that the form should be locked due to data input period, OR
    // that the form should be locked because an organisation unit is out of range, SO
    // set to OPEN unless frontend check has identified that data input period as out-of-bounds
    if (
        ![
            LockedStates.LOCKED_DATA_INPUT_PERIOD,
            LockedStates.LOCKED_ORGANISATION_UNIT,
        ].includes(frontEndLockStatus)
    ) {
        setLockStatus(LockedStates.OPEN)
    }
}
