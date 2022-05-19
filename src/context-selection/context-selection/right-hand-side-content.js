import React from 'react'
import OptionsButton from './options-button.js'
import styles from './right-hand-side-content.module.css'

export default function RightHandSideContent() {
    return (
        <div className={styles.container}>
            <OptionsButton />
        </div>
    )
}
