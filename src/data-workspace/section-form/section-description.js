import * as DOMPurify from 'dompurify'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './section.module.css'

export const SectionDescription = ({ children }) => {
    if (!children) {
        return null
    }
    const html = DOMPurify.sanitize(children, {
        ALLOWED_TAGS: ['a', 'b', 'strong', 'underline'],
    })

    return (
        <div
            className={styles.sectionDescription}
            dangerouslySetInnerHTML={{ __html: html }}
        ></div>
    )
}

SectionDescription.propTypes = {
    children: PropTypes.node,
}
