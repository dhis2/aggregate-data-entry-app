import classNames from 'classnames'
import React from 'react'
import { OptionsButton } from '../options/index.js'
import styles from './right-hand-side-content.module.css'

export default function RightHandSideContent() {
    const containerStyles = classNames(styles.container, 'hide-for-print')
    return (
        <div className={containerStyles}>
            <OptionsButton />
        </div>
    )
}
