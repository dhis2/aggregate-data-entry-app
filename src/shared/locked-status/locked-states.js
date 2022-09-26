export const LockedStates = Object.freeze({
    OPEN: 'Open',
    LOCKED_DATA_INPUT_PERIOD: 'Locked_data_input_period',
    LOCKED_EXPIRY_DAYS: 'Locked_expiry_days',
    LOCKED_APPROVED: 'Locked_approved',
})

export const BackendLockStatusMap = Object.freeze({
    LOCKED: LockedStates.LOCKED_EXPIRY_DAYS,
    APPROVED: LockedStates.LOCKED_APPROVED,
})