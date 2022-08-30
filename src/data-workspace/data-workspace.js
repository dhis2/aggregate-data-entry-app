import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { MutationIndicator } from '../app/mutation-indicator/index.js'
import { BottomBar } from '../bottom-bar/index.js'
import {
    useMetadata,
    selectors,
    useDataSetId,
    useSelectionKey,
    useDataValueSet,
    useIsValidSelection,
} from '../shared/index.js'
import styles from './data-workspace.module.css'
import { EntryForm } from './entry-form.js'
import { FinalFormWrapper } from './final-form-wrapper.js'

export const DataWorkspace = ({ selectionHasNoFormMessage }) => {
    const { data } = useMetadata()
    const initialDataValuesFetch = useDataValueSet()
    const isValidSelection = useIsValidSelection()
    const [dataSetId] = useDataSetId()
    // used to reset form-state when context-selection is changed
    const formId = useSelectionKey()

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
        <FinalFormWrapper key={formId} dataValueSet={dataValueSet}>
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
