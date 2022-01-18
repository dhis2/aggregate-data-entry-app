import { CustomDataProvider } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import BasicInformation from './basic-information.js'
import Comment from './comment.js'
import ItemPropType from './item-prop-type.js'
import Limits from './limits.js'
import styles from './sidebar.module.css'
import Title from './title.js'

const mockData = {
    comment: 'Some comment',
    limits: {
        avg: 238,
        min: 50,
        max: 250,
    },
}

const Sidebar = ({ item, onMarkForFollowup, onUnmarkForFollowup, onClose }) => (
    // TODO: remove CustomDataProvider
    <CustomDataProvider data={mockData}>
        <div className={styles.wrapper}>
            <Title onClose={onClose} />
            <BasicInformation
                item={item}
                onMarkForFollowup={onMarkForFollowup}
                onUnmarkForFollowup={onUnmarkForFollowup}
            />
            <Comment itemId={item.id} />
            <Limits itemId={item.id} disabled={item.type !== 'numerical'} />
        </div>
    </CustomDataProvider>
)

Sidebar.propTypes = {
    item: ItemPropType.isRequired,
    onClose: PropTypes.func.isRequired,
    onMarkForFollowup: PropTypes.func.isRequired,
    onUnmarkForFollowup: PropTypes.func.isRequired,
}

export default Sidebar
