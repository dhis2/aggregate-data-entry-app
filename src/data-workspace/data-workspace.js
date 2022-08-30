import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import classNames from 'classnames'
import React from 'react'
import { MutationIndicator } from '../app/mutation-indicator/index.js'
import { BottomBar } from '../bottom-bar/index.js'
import {
    useMetadata,
    selectors,
    useDataSetId,
    useDataValueSet,
    useIsValidSelection,
    useNoFormOrLockedContext,
} from '../shared/index.js'
import styles from './data-workspace.module.css'
import { EntryForm } from './entry-form.js'
import { FinalFormWrapper } from './final-form-wrapper.js'

export const DataWorkspace = () => {
    const { data } = useMetadata()
    const [dataSetId] = useDataSetId()
    const initialDataValuesFetch = useDataValueSet()
    const isValidSelection = useIsValidSelection()
    const noFormOrLocked = useNoFormOrLockedContext()

    if (noFormOrLocked?.message && !noFormOrLocked?.inForm) {
        return (
            <NoticeBox
                className={styles.warningBoxMargin}
                error={noFormOrLocked?.error}
                title={noFormOrLocked?.title}
            >
                {noFormOrLocked?.message}
            </NoticeBox>
        )
    }

    if (!isValidSelection) {
        return null
    }

    if (initialDataValuesFetch.isLoading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (initialDataValuesFetch.error) {
        return 'Error!'
    }

    if (!data || !dataSetId) {
        return null
    }

    const dataSet = selectors.getDataSetById(data, dataSetId)
    if (!dataSet) {
        console.warn('Could not find dataSet with ID', dataSetId)
        return 'Error!'
    }

    const footerClasses = classNames(styles.footer, 'hide-for-print')
    const dataValueSet = initialDataValuesFetch.data?.dataValues

    return (
        <FinalFormWrapper dataValueSet={dataValueSet}>
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
