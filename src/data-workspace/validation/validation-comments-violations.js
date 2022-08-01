import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './validation-comments-violations.module.css'

const ValidationCommentsViolations = ({ commentRequiredViolations }) => {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>
                {i18n.t('Required comments summary')}
            </h1>
            <div className={styles.result}>
                <div>
                    {i18n.t(
                        'The following fields require a comment if left empty:'
                    )}
                </div>
                <ul>
                    {commentRequiredViolations?.map(
                        ({ displayShortName, id }) => (
                            <li key={id}>{displayShortName}</li>
                        )
                    )}
                </ul>
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
