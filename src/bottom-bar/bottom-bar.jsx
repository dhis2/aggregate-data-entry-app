import React from 'react'
import { useHighlightedFieldStore } from '../shared/index.js'
import styles from './bottom-bar.module.css'
import DataItemBar from './data-item-bar.jsx'
import MainToolBar from './main-tool-bar.jsx'

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
