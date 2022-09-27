import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    Button,
    ButtonStrip,
    SingleSelect,
    SingleSelectOption,
    TextAreaFieldFF,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Form, useField } from 'react-final-form'
import {
    ExpandableUnit,
    selectors,
    useLockedContext,
    useMetadata,
    useSetDataValueMutation,
} from '../../shared/index.js'
import styles from './comment.module.css'
import LoadingError from './loading-error.js'

const title = i18n.t('Comment')
const errorMessage = i18n.t(
    'There was a problem loading the comment for this data item'
)

const CommentOptionSelector = ({ commentOptionSetId, inputOnChange }) => {
    const { data: metadata } = useMetadata()

    const optionSet = selectors.getOptionSetById(metadata, commentOptionSetId)
    // filter out 'null' options
    const options = optionSet?.options?.filter((opt) => !!opt)

    if (!(options?.length > 0)) {
        return null
    }

    return (
        <SingleSelect
            placeholder={i18n.t('Choose an option')}
            onChange={({ selected }) => {
                inputOnChange(
                    options.find((o) => o.code === selected)?.displayName
                )
            }}
            className={styles.commentOptionSelect}
        >
            {options.map(({ id, code, displayName }) => (
                <SingleSelectOption key={id} label={displayName} value={code} />
            ))}
        </SingleSelect>
    )
}

CommentOptionSelector.propTypes = {
    commentOptionSetId: PropTypes.string,
    inputOnChange: PropTypes.func,
}

const CommentEditField = ({ comment, commentOptionSetId }) => {
    const { input, meta } = useField('comment', {
        subscription: { value: true },
        initialValue: comment || '',
    })

    return (
        <>
            {commentOptionSetId && (
                <CommentOptionSelector
                    commentOptionSetId={commentOptionSetId}
                    inputOnChange={input.onChange}
                />
            )}
            <TextAreaFieldFF
                input={input}
                meta={meta}
                className={styles.textArea}
            />
        </>
    )
}

CommentEditField.propTypes = {
    comment: PropTypes.string,
    commentOptionSetId: PropTypes.string,
}

function CommentEditForm({ item, open, setOpen, syncComment, closeEditor }) {
    const onSubmit = (values) => {
        // Don't send `undefined` (or 'undefined' will be stored as the comment)
        const comment = values.comment || ''
        syncComment({ comment })
        closeEditor()
    }

    return (
        <ExpandableUnit title={title} open={open} onToggle={setOpen}>
            <Form onSubmit={onSubmit}>
                {({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <CommentEditField
                            comment={item?.comment}
                            commentOptionSetId={item?.commentOptionSetId}
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
        commentOptionSetId: PropTypes.string,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    syncComment: PropTypes.func.isRequired,
}

export default function Comment({ item }) {
    const { locked } = useLockedContext()
    const [open, setOpen] = useState(true)
    const [editing, setEditing] = useState(false)
    const setDataValueComment = useSetDataValueMutation({
        deId: item.dataElement,
        cocId: item.categoryOptionCombo,
    })

    // Only show loader if request is in flight,
    // otherwise spinner can show endlessly while paused offline
    if (setDataValueComment.isLoading && !setDataValueComment.isPaused) {
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

            <Button
                small
                secondary
                onClick={() => setEditing(true)}
                disabled={locked}
            >
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
        commentOptionSetId: PropTypes.string,
    }).isRequired,
}
