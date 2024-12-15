import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { LockedStates, useLockedContext } from '../shared/index.js'
import { FORM_TYPES } from './constants.js'
import { CustomForm } from './custom-form/index.js'
import { DefaultForm } from './default-form.js'
import FilterField from './filter-field.js'
import { getDisplayOptions } from './section-form/displayOptions.js'
import { SectionForm } from './section-form/index.js'
import { SanitizedText } from './section-form/sanitized-text.js'
import styles from './section-form/section.module.css'

const lockedNoticeBoxMessages = {
    [LockedStates.LOCKED_DATA_INPUT_PERIOD]: i18n.t(
        'Data cannot be added or changed outside of the data input period.'
    ),
    [LockedStates.LOCKED_ORGANISATION_UNIT]: i18n.t(
        'Data cannot be added or changed because organisation unit is closed for the selected period.'
    ),
    [LockedStates.LOCKED_EXPIRY_DAYS]: i18n.t(
        'Data cannot be added or changed because data entry has concluded.'
    ),
    [LockedStates.LOCKED_APPROVED]: i18n.t(
        'Data cannot be added or changed because data has been approved.'
    ),
    [LockedStates.LOCKED_NO_AUTHORITY]: i18n.t(
        'You do not have the authority to edit entry forms'
    ),
}

const formTypeToComponent = {
    DEFAULT: DefaultForm,
    SECTION: SectionForm,
    CUSTOM: CustomForm,
}

export const EntryForm = React.memo(function EntryForm({ dataSet }) {
    const [globalFilterText, setGlobalFilterText] = React.useState('')
    const {
        locked,
        lockStatus: { state: lockState },
    } = useLockedContext()
    const formType = dataSet.formType

    const Component = formTypeToComponent[formType]
    const displayOptions = getDisplayOptions(dataSet)

    return (
        <>
            {locked && (
                <NoticeBox title={i18n.t('Data set locked')}>
                    {lockedNoticeBoxMessages[lockState]}
                </NoticeBox>
            )}
            {formType !== FORM_TYPES.CUSTOM && (
                <FilterField
                    value={globalFilterText}
                    setFilterText={setGlobalFilterText}
                    formType={formType}
                />
            )}
            <div
                className={cx(styles.sectionsCustomText, {
                    [styles.textStartLine]:
                        displayOptions.customText?.align === 'line-start',
                    [styles.textCenter]:
                        displayOptions.customText?.align === 'center',
                    [styles.textEndLine]:
                        !displayOptions.customText ||
                        displayOptions.customText?.align === 'line-end',
                })}
            >
                {displayOptions.customText?.header && (
                    <SanitizedText className={styles.sectionsTitle}>
                        {displayOptions.customText?.header}
                    </SanitizedText>
                )}
                {displayOptions.customText?.subheader && (
                    <SanitizedText className={styles.sectionsSubtitle}>
                        {displayOptions.customText?.subheader}
                    </SanitizedText>
                )}
            </div>
            <Component dataSet={dataSet} globalFilterText={globalFilterText} />
        </>
    )
})

EntryForm.propTypes = {
    dataSet: PropTypes.shape({
        displayName: PropTypes.string,
        formType: PropTypes.string,
        id: PropTypes.string,
    }),
}
