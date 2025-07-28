import { CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './root-loading.module.css'

export const RootLoading = ({
    dataTest = 'dhis2-uiwidgets-orgunittree-loading',
}) => (
    <div data-test={dataTest} className={styles.rootLoading}>
        <CircularLoader small />
    </div>
)

RootLoading.propTypes = {
    dataTest: PropTypes.string,
}
