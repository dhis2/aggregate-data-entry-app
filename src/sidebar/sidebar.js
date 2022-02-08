import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useCurrentItem } from '../current-item-provider/index.js'
import { useSidebar } from './context/index.js'
import { ContextualHelp } from './contextual-help/index.js'
import { DataDetails } from './data-details/index.js'
import styles from './sidebar.module.css'
import Title from './title.js'

const useContent = () => {
    const { contentType } = useSidebar()
    const currentItem = useCurrentItem()

    switch (contentType) {
        case 'DATA_DETAILS':
            // TODO: onMarkForFollowup
            // TODO: onUnmarkForFollowup
            return {
                title: i18n.t('Details'),
                content: (
                    <DataDetails
                        item={currentItem}
                        onMarkForFollowup={() => {}}
                        onUnmarkForFollowup={() => {}}
                    />
                ),
            }
        case 'CONTEXTUAL_HELP':
            return {
                title: i18n.t('Help'),
                content: <ContextualHelp />,
            }
        default:
            throw new Error(`Unknown sidebar content type: '${contentType}'`)
    }
}

const Sidebar = () => {
    const { close } = useSidebar()
    const { title, content } = useContent()

    return (
        <div className={styles.wrapper}>
            <Title title={title} onClose={close} />
            {content}
        </div>
    )
}

export default Sidebar
