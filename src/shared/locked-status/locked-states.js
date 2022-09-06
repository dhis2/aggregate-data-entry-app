import i18n from '@dhis2/d2-i18n'

export const LockedStates = Object.freeze({
    OPEN: {
        message: '',
        error: false,
        title: '',
        inForm: false,
        locked: false,
    },
    DATA_INPUT_PERIOD_OUT_OF_RANGE: (dip) => ({
        message: i18n.t(
            'Data cannot be added or changed outside of the data input period ({{dataInputPeriod}}).',
            {
                dataInputPeriod: `${dip.openingDate.substring(
                    0,
                    10
                )} - ${dip.closingDate.substring(0, 10)}`,
            }
        ),
        error: false,
        inForm: true,
        title: i18n.t('Data set locked'),
        locked: true,
    }),
    EXPIRY_DAYS: {
        message: i18n.t(
            'Data cannot be added or changed as data entry has concluded.'
        ),
        error: false,
        inForm: true,
        title: i18n.t('Data set locked'),
        locked: true,
    },
})
