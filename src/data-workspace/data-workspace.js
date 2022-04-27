import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    useContextSelection,
    useIsValidSelection,
} from '../context-selection/index.js'
import { useMetadata } from '../metadata/index.js'
import { getDataSetById } from '../metadata/selectors.js'
import styles from './data-workspace.module.css'
import { EntryForm } from './entry-form.js'
import { FinalFormWrapper } from './final-form-wrapper.js'
import { KeyboardNavManager } from './keyboard-nav-manager.js'
import { useInitialDataValues } from './use-initial-data-values.js'

export const DataWorkspace = ({ selectionHasNoFormMessage }) => {
    const [{ dataSetId }] = useContextSelection()
    const { isLoading, isError, data } = useMetadata()
    const initialDataValuesFetch = useInitialDataValues()
    const isValidSelection = useIsValidSelection()

    if (selectionHasNoFormMessage) {
        const title = i18n.t('The current selection does not have a form')
        return <NoticeBox title={title}>{selectionHasNoFormMessage}</NoticeBox>
    }

    if (!isValidSelection) {
        return null
    }

    if (isLoading || initialDataValuesFetch.isLoading) {
        return <CircularLoader />
    }

    if (isError || initialDataValuesFetch.error) {
        return 'Error!'
    }

    if (!data || !dataSetId) {
        return null
    }

    const dataSet = getDataSetById(data, dataSetId)
    if (!dataSet) {
        console.warn('Could not find dataSet with ID', dataSetId)
        return 'Error!'
    }

    return (
        <KeyboardNavManager>
            <FinalFormWrapper initialValues={initialDataValuesFetch.data}>
                <div className={styles.wrapper}>
                    <EntryForm dataSet={dataSet} />
                </div>
            </FinalFormWrapper>
        </KeyboardNavManager>
    )
}

DataWorkspace.propTypes = {
    selectionHasNoFormMessage: PropTypes.string,
}
