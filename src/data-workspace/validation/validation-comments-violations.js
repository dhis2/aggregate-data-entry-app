import i18n from '@dhis2/d2-i18n'
import { IconMessages24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './validation-comments-violations.module.css'

const ValidationCommentsViolations = ({ commentRequiredViolations }) => {
    const commentsCount = commentRequiredViolations?.length

    if (!commentsCount) {
        return null
    }

    const title =
        commentRequiredViolations?.length === 1
            ? i18n.t('1 comment required')
            : i18n.t('{{commentsCount}} comments required', {
                  commentsCount,
              })

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>
                <IconMessages24 color={colors.grey600} />
                {title}
            </h1>
            <div className={styles.result}>
                <div data-test="validation-comments-violations">
                    {commentRequiredViolations?.map(
                        ({ displayShortName, id }) => (
                            <div
                                key={id}
                                className={styles.commentViolationRule}
                            >
                                {i18n.t(
                                    "{{displayShortName}} must have a comment when it doesn't have a value.",
                                    { displayShortName }
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
ValidationCommentsViolations.propTypes = {
    commentRequiredViolations: PropTypes.arrayOf(
        PropTypes.shape({
            displayShortName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
}
export default ValidationCommentsViolations
