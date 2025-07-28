import { CircularLoader } from '@dhis2/ui'
import React from 'react'
import styles from './loading-spinner.module.css'

/**
 * After moving this component to this app repo, the tests broke
 * due to styled-jsx's resolve helper. So for now as an easy fix,
 * we're just using a css-module.
 * If this component were to move back to @dhis2/ui we'd have to
 * ensure this change is not included.
 */
export const LoadingSpinner = () => (
    <div className={styles.container}>
        <CircularLoader extrasmall className={styles.extraSmall} />
    </div>
)
