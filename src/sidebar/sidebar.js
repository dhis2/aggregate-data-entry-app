import PropTypes from 'prop-types'
import React from 'react'
import BasicInformation from './basic-information.js'
import Comment from './comment.js'
import ItemPropType from './item-prop-type.js'
import styles from './sidebar.module.css'
import Title from './title.js'

const Sidebar = ({ item, onMarkForFollowup, onUnmarkForFollowup, onClose }) => (
    <div className={styles.wrapper}>
        <Title onClose={onClose} />
        <BasicInformation
            item={item}
            onMarkForFollowup={onMarkForFollowup}
            onUnmarkForFollowup={onUnmarkForFollowup}
        />
        <Comment itemId={item.id} disabled={false} />
    </div>
)

Sidebar.propTypes = {
    item: ItemPropType.isRequired,
    onClose: PropTypes.func.isRequired,
    onMarkForFollowup: PropTypes.func.isRequired,
    onUnmarkForFollowup: PropTypes.func.isRequired,
}

export default Sidebar
