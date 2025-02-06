import { NoticeBox } from '@dhis2/ui'
import { node, string } from 'prop-types'
import React from 'react'
import css from './error-message.module.css'

const ErrorMessage = ({ children, title }) => (
    <div className={css.wrapper}>
        <NoticeBox error title={title}>
            {children}
        </NoticeBox>
    </div>
)

ErrorMessage.propTypes = {
    children: node.isRequired,
    title: string.isRequired,
}

export default ErrorMessage
