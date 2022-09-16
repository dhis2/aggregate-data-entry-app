import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { MutationIndicator } from '../app/mutation-indicator/index.js'
import { BottomBar } from '../bottom-bar/index.js'
import {
    useMetadata,
    selectors,
    updateLockStatusFromBackend,
    useCheckLockStatus,
    useDataSetId,
    useContextSelectionId,
    useDataValueSet,
    useIsValidSelection,
    useLockedContext,
    useValueStore,
} from '../shared/index.js'
import styles from './data-workspace.module.css'
import { EntryForm } from './entry-form.js'
import { FinalFormWrapper } from './final-form-wrapper.js'

export const DataWorkspace = ({ selectionHasNoFormMessage }) => {
    const { data: metadata } = useMetadata()
    useCheckLockStatus()
    const { lockStatus: frontEndLockStatus, setLockStatus } = useLockedContext()

    const updateStore = useValueStore((state) => state.setDataValueSet)
    const initialDataValuesFetch = useDataValueSet({
        onSuccess: (data) => {
            updateLockStatusFromBackend(
                frontEndLockStatus,
                data?.lockStatus,
                setLockStatus
            )
        },
    })

    useEffect(() => {
        updateStore(initialDataValuesFetch.data)
    }, [updateStore, initialDataValuesFetch.data])

    const isValidSelection = useIsValidSelection()
    const [dataSetId] = useDataSetId()
    // used to reset form-state when context-selection is changed
    const formKey = useContextSelectionId()

    if (selectionHasNoFormMessage) {
        const title = i18n.t('The current selection does not have a form')
        return (
            <NoticeBox title={title} className={styles.formMessageBox} error>
                {selectionHasNoFormMessage}
            </NoticeBox>
        )
    }

    if (!isValidSelection) {
        return null
    }

    // Currently this can cause the form to reload when going back online
    if (
        initialDataValuesFetch.isFetching &&
        initialDataValuesFetch.data === undefined
    ) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (initialDataValuesFetch.error) {
        return (
            <NoticeBox
                title={i18n.t('There was a problem loading data values')}
                className={styles.formMessageBox}
                error
            >
                {initialDataValuesFetch.error?.message}
            </NoticeBox>
        )
    }

    // If loading a form while client is offline, since useDataValueSet uses
    // networkMode = 'offlineFirst', the initialDataValuesFetch query may be
    // PAUSED and its data will be undefined, in which case an empty form
    // should be shown for the user to enter data

    if (!metadata || !dataSetId) {
        return null
    }

    const dataSet = selectors.getDataSetById(metadata, dataSetId)

    const footerClasses = classNames(styles.footer, 'hide-for-print')
    const dataValueSet = initialDataValuesFetch.data?.dataValues

    return (
        <FinalFormWrapper key={formKey} dataValueSet={dataValueSet}>
            <div className={styles.wrapper}>
                <main id="data-workspace" className={styles.formWrapper}>
                    <div className={styles.formArea}>
                        <EntryForm dataSet={dataSet} />
                    </div>
                </main>

                <footer className={footerClasses}>
                    <div
                        // This div and its content will be removed
                        // once we can display this in the headerbar
                        className={styles.mutationIndicator}
                    >
                        <MutationIndicator />
                    </div>
                    <BottomBar />
                </footer>
            </div>
        </FinalFormWrapper>
    )
}

DataWorkspace.propTypes = {
    selectionHasNoFormMessage: PropTypes.string,
}
