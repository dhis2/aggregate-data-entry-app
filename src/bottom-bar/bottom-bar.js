import React from 'react'
import { useHighlightedFieldStore } from '../shared/index.js'
import styles from './bottom-bar.module.css'
import DataItemBar from './data-item-bar.js'
import MainToolBar from './main-tool-bar.js'

export default function BottomBar() {
    const highlightedField = useHighlightedFieldStore((state) =>
        state.getHighlightedField()
    )
    const showDataItemBar = !!highlightedField

    return (
        <div className={styles.bottomBar}>
            {showDataItemBar && <DataItemBar />}
            <MainToolBar />
        </div>
    )
}
