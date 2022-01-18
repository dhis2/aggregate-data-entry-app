import { useDataQuery, useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    NoticeBox,
    Button,
    ButtonStrip,
    ReactFinalForm,
    TextAreaFieldFF,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styles from './comment.module.css'
import ToggleableUnit from './toggleable-unit.js'

// TODO
const query = {
    comment: {
        resource: 'comment',
        id: ({ id }) => id,
    },
}

// TODO
const mutation = {}

const Comment = ({ itemId }) => {
    const [editing, setEditing] = useState(false)
    const { called, loading, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const fetchComment = () => {
        setEditing(false)
        refetch({ id: itemId })
    }
    const errorAlert = useAlert(
        i18n.t('There was a problem saving the data item comment.'),
        { critical: true }
    )
    const [updateComment] = useDataMutation(mutation, {
        onError: () => errorAlert.show(),
        onComplete: fetchComment,
    })

    useEffect(fetchComment, [itemId])

    if (!called || loading) {
        return <CircularLoader small />
    }

    if (error) {
        return (
            <NoticeBox
                error
                title={i18n.t(
                    'There was a problem loading the comment for this data item'
                )}
            >
                {i18n.t('Try again, or contact your system administrator')}
            </NoticeBox>
        )
    }

    if (editing) {
        return (
            <ReactFinalForm.Form
                onSubmit={({ comment }) =>
                    updateComment({ id: itemId, comment })
                }
            >
                {({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <ReactFinalForm.Field
                            name="comment"
                            component={TextAreaFieldFF}
                            className={styles.textArea}
                            initialValue={comment}
                            dense
                            autoGrow
                        />
                        <ButtonStrip>
                            <Button
                                small
                                primary
                                type="submit"
                                loading={submitting}
                            >
                                {submitting
                                    ? i18n.t('Saving...')
                                    : i18n.t('Save comment')}
                            </Button>
                            <Button
                                small
                                secondary
                                onClick={() => setEditing(false)}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                        </ButtonStrip>
                    </form>
                )}
            </ReactFinalForm.Form>
        )
    }

    const { comment } = data
    return (
        <>
            <p className={comment ? styles.comment : styles.placeholder}>
                {comment ? comment : i18n.t('No comment for this data item.')}
            </p>
            <Button small secondary onClick={() => setEditing(true)}>
                {comment ? i18n.t('Edit comment') : i18n.t('Add comment')}
            </Button>
        </>
    )
}

Comment.propTypes = {
    itemId: PropTypes.string.isRequired,
}

const CommentUnit = ({ itemId, disabled }) => (
    <ToggleableUnit title={i18n.t('Comment')} disabled={disabled}>
        <Comment itemId={itemId} />
    </ToggleableUnit>
)

CommentUnit.propTypes = {
    itemId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
}

export default CommentUnit
