import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './error-message.module.css'

const ErrorMessage = ({ children, title }) => (
    <div className={classes.wrapper}>
        <NoticeBox error title={title}>
            {children}
        </NoticeBox>
    </div>
)

ErrorMessage.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
}

export { ErrorMessage }
