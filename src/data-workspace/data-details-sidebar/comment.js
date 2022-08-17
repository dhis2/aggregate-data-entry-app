import i18n from '@dhis2/d2-i18n'
import { CircularLoader, Button, ButtonStrip, TextAreaFieldFF } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'
import { ExpandableUnit } from '../../shared/index.js'
import { useSetDataValueMutation } from '../use-data-value-mutation/_data-value-mutations.js'
// import { useSetDataValueCommentMutation } from '../use-data-value-mutation/index.js'
import styles from './comment.module.css'
import LoadingError from './loading-error.js'

const title = i18n.t('Comment')
const errorMessage = i18n.t(
    'There was a problem loading the comment for this data item'
)

function CommentEditForm({ item, open, setOpen, syncComment, closeEditor }) {
    const onSubmit = (values) => {
        return syncComment(
            // Don't send `undefined` (or 'undefined' will be stored as the comment)
            { comment: values.comment || '' },
            { onSuccess: closeEditor }
        )
    }

    return (
        <ExpandableUnit title={title} open={open} onToggle={setOpen}>
            <Form onSubmit={onSubmit}>
                {({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <Field
                            name="comment"
                            component={TextAreaFieldFF}
                            className={styles.textArea}
                            initialValue={item.comment}
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
                                disabled={submitting}
                                onClick={closeEditor}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                        </ButtonStrip>
                    </form>
                )}
            </Form>
        </ExpandableUnit>
    )
}

CommentEditForm.propTypes = {
    closeEditor: PropTypes.func.isRequired,
    item: PropTypes.shape({
        categoryOptionCombo: PropTypes.string.isRequired,
        dataElement: PropTypes.string.isRequired,
        comment: PropTypes.string,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    syncComment: PropTypes.func.isRequired,
}

export default function Comment({ item }) {
    const [open, setOpen] = useState(true)
    const [editing, setEditing] = useState(false)
    const setDataValueComment = useSetDataValueMutation({
        deId: item.dataElement,
        cocId: item.categoryOptionCombo,
    })

    if (setDataValueComment.isLoading) {
        return (
            <ExpandableUnit title={title} open={open} onToggle={setOpen}>
                <CircularLoader small />
            </ExpandableUnit>
        )
    }

    if (setDataValueComment.isError) {
        return (
            <ExpandableUnit title={title} open={open} onToggle={setOpen}>
                <LoadingError title={errorMessage} />
            </ExpandableUnit>
        )
    }

    if (editing) {
        return (
            <CommentEditForm
                item={item}
                open={open}
                setOpen={setOpen}
                syncComment={setDataValueComment.mutate}
                closeEditor={() => setEditing(false)}
            />
        )
    }

    return (
        <ExpandableUnit title={title} open={open} onToggle={setOpen}>
            {item.comment && (
                <pre
                    // Using <pre /> so text area line
                    // breaks are displayed correctly
                    className={styles.comment}
                >
                    {item.comment}
                </pre>
            )}

            {!item.comment && (
                <p
                    className={
                        item.comment ? styles.comment : styles.placeholder
                    }
                >
                    {i18n.t('No comment for this data item.')}
                </p>
            )}

            <Button small secondary onClick={() => setEditing(true)}>
                {item.comment ? i18n.t('Edit comment') : i18n.t('Add comment')}
            </Button>
        </ExpandableUnit>
    )
}

Comment.propTypes = {
    item: PropTypes.shape({
        categoryOptionCombo: PropTypes.string.isRequired,
        dataElement: PropTypes.string.isRequired,
        comment: PropTypes.string,
    }).isRequired,
}
