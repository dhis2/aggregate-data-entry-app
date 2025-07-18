import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { BottomBar } from '../bottom-bar/index.js'
import {
    useMetadata,
    selectors,
    useCheckLockStatus,
    useDataSetId,
    useContextSelectionId,
    useDataValueSet,
    useIsValidSelection,
    useValueStore,
    dataValueSetQueryKey,
    useEntryFormStore,
} from '../shared/index.js'
import styles from './data-workspace.module.css'
import { EntryForm } from './entry-form.jsx'
import { EntryScreen } from './entry-screen.jsx'
import { FormWrapper } from './final-form-wrapper.jsx'
import { useHandleHeaderbarStatus } from './use-handle-headerbar-status.js'

export const DataWorkspace = ({ selectionHasNoFormMessage }) => {
    const queryClient = useQueryClient()
    const { data: metadata } = useMetadata()
    useHandleHeaderbarStatus()
    useCheckLockStatus()
    const updateStore = useValueStore((state) => state.setDataValueSet)
    const initialDataValuesFetch = useDataValueSet()

    useEffect(() => {
        updateStore(initialDataValuesFetch.data)
    }, [updateStore, initialDataValuesFetch.data])

    const setCompleteAttempted = useEntryFormStore(
        (state) => state.setCompleteAttempted
    )

    const isValidSelection = useIsValidSelection()
    const [dataSetId] = useDataSetId()
    // used to reset form-state when context-selection is changed
    const formKey = useContextSelectionId()

    // to keep one stable dependency for effect below
    const validFormKey = isValidSelection ? formKey : false
    // force refetch when context-selection changes
    useEffect(() => {
        if (validFormKey) {
            // note this will only refetch "active"/mounted queries,
            // so it's safe to not provide params
            queryClient.invalidateQueries(
                dataValueSetQueryKey.all,
                { type: 'active' },
                {
                    // if new selection is not in cache, a fetch will already be in-flight
                    // so we do not need to send another one.
                    cancelRefetch: false,
                }
            )

            // reset the completionAttempted store for new form
            setCompleteAttempted(false)
        }
    }, [validFormKey, queryClient, setCompleteAttempted])

    if (selectionHasNoFormMessage) {
        const title = i18n.t('The current selection does not have a form')
        return (
            <NoticeBox title={title} className={styles.formMessageBox} error>
                {selectionHasNoFormMessage}
            </NoticeBox>
        )
    }

    if (!isValidSelection) {
        return <EntryScreen />
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

    // We want to block initialization of form if in-flight
    // or else we might use stale data that won't be updated once request completes
    if (
        initialDataValuesFetch.isFetching ||
        initialDataValuesFetch.isInitialLoading
    ) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
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

    const footerClasses = classNames(styles.footer, styles.hideForPrint)
    const dataValueSet = initialDataValuesFetch.data?.dataValues

    return (
        <FormWrapper
            key={formKey}
            dataValueSet={dataValueSet}
            validFormKey={validFormKey}
        >
            <div className={styles.wrapper}>
                <main id="data-workspace" className={styles.formWrapper}>
                    <div className={styles.formArea}>
                        <EntryForm dataSet={dataSet} />
                    </div>
                </main>

                <footer className={footerClasses}>
                    <BottomBar />
                </footer>
            </div>
        </FormWrapper>
    )
}

DataWorkspace.propTypes = {
    selectionHasNoFormMessage: PropTypes.string,
}
