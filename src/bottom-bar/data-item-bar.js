import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { dataDetailsSidebarId } from '../data-workspace/constants.js'
import { useMetadata, selectors } from '../metadata/index.js'
import { useRightHandPanelContext } from '../right-hand-panel/index.js'
import { useHighlightedField } from '../shared/index.js'
import styles from './data-item-bar.module.css'

export default function DataItemBar() {
    const rightHandPanel = useRightHandPanelContext()
    const item = useHighlightedField()
    const { data: metadata } = useMetadata()

    const dataElement = selectors.getDataElementById(metadata, item.dataElement)
    const categoryOptions = selectors.getCategoryOptionsByCategoryOptionComboId(
        metadata,
        item.categoryOptionCombo
    )

    // We don't want to display "default"
    const categoryOptionComboDisplayName = categoryOptions
        .filter(({ isDefault }) => !isDefault)
        .map(({ displayShortName }) => displayShortName)
        .join(', ')

    return (
        <div className={styles.container}>
            <span className={styles.name}>
                {dataElement.displayName}
                {categoryOptionComboDisplayName &&
                    ` | ${categoryOptionComboDisplayName}`}
            </span>

            <Button
                small
                className={styles.dataDetailsButton}
                onClick={() => {
                    rightHandPanel.id
                        ? rightHandPanel.hide()
                        : rightHandPanel.show(dataDetailsSidebarId)
                }}
            >
                {
                    rightHandPanel.id
                        ? i18n.t('Hide details')
                        : i18n.t('View details')
                }
            </Button>
        </div>
    )
}
