import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useCurrentItem } from '../current-item-provider/index.js'
import { useSidebar } from './context/index.js'
import { ContextualHelp } from './contextual-help/index.js'
import { DataDetails } from './data-details/index.js'
import styles from './sidebar.module.css'
import Title from './title.js'

// TODO: onMarkForFollowup
// TODO: onUnmarkForFollowup
function Content({ contentType }) {
    const { currentItem } = useCurrentItem()

    if (contentType === 'DATA_DETAILS') {
        return (
            <DataDetails
                item={currentItem}
                onMarkForFollowup={() => {}}
                onUnmarkForFollowup={() => {}}
            />
        )
    }

    return <ContextualHelp />
}

Content.propTypes = {
    contentType: PropTypes.oneOf(['DATA_DETAILS', 'CONTEXTUAL_HELP']),
}

export default function Sidebar() {
    const { contentType, close } = useSidebar()
    const title =
        contentType === 'DATA_DETAILS' ? i18n.t('Details') : i18n.t('Help')

    return (
        <div className={styles.wrapper}>
            <Title title={title} onClose={close} />
            <Content contentType={contentType} />
        </div>
    )
}
