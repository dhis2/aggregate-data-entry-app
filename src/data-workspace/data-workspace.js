import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { FinalFormWrapper } from './data-entry-cell/index.js'
import styles from './data-workspace.module.css'
import { EntryForm } from './entry-form.js'
import { useDataSet } from './use-data-set.js'
import { useInitialDataValues } from './use-initial-data-values.js'

export const DataWorkspace = ({ selectionHasNoFormMessage }) => {
    const dataSetFetch = useDataSet()
    const initialDataValuesFetch = useInitialDataValues()

    if (selectionHasNoFormMessage) {
        const title = i18n.t('The current selection does not have a form')
        return <NoticeBox title={title}>{selectionHasNoFormMessage}</NoticeBox>
    }

    if (dataSetFetch.isIdle || initialDataValuesFetch.isIdle) {
        return null
    }

    if (dataSetFetch.isLoading || initialDataValuesFetch.isLoading) {
        return <CircularLoader />
    }

    if (dataSetFetch.error || initialDataValuesFetch.error) {
        return 'Error!'
    }

    return (
        <div className={styles.wrapper}>
            <FinalFormWrapper initialValues={initialDataValuesFetch.data}>
                <EntryForm dataSet={dataSetFetch.data} />
            </FinalFormWrapper>
        </div>
    )
}

DataWorkspace.propTypes = {
    selectionHasNoFormMessage: PropTypes.string,
}
