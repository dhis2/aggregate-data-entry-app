import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    SingleSelect,
    SingleSelectOption,
    TextAreaFieldFF,
    Tooltip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { Form, useField } from 'react-final-form'
import {
    ExpandableUnit,
    selectors,
    useCanUserEditFields,
    useContextSelectionId,
    useLockedContext,
    useMetadata,
    useSetDataValueMutation,
    useUnsavedDataStore,
    getCellId,
} from '../../shared/index.js'
import styles from './comment.module.css'
import LoadingError from './loading-error.js'

const title = i18n.t('Comment')
const errorMessage = i18n.t(
    'There was a problem updating the comment for this data item'
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

const CommentEditField = ({
    fieldName,
    comment,
    commentOptionSetId,
    onBlur,
    unsavedComment,
}) => {
    const { input, meta } = useField(fieldName, {
        subscription: { value: true },
        initialValue: unsavedComment || comment || '',
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
                onBlur={onBlur}
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
    fieldName: PropTypes.string,
    unsavedComment: PropTypes.string,
    onBlur: PropTypes.func,
}

function CommentEditForm({
    item,
    open,
    setOpen,
    syncComment,
    closeEditor,
    unsavedComment,
    commentId,
    isError,
}) {
    const contextSelectionId = useContextSelectionId()
    const cellId = getCellId({ contextSelectionId, item })
    const setUnsavedComment = useUnsavedDataStore(
        (state) => state.setUnsavedComment
    )

    const deleteUnsavedComment = useUnsavedDataStore(
        (state) => state.deleteUnsavedComment
    )

    const fieldName = `comment_${commentId}`

    const onSubmit = async (values) => {
        try {
            // Don't send `undefined` (or 'undefined' will be stored as the comment)
            const comment = values[fieldName] || ''
            await syncComment({ comment })
            deleteUnsavedComment(cellId)
            closeEditor()
        } catch (err) {
            console.error(err)
        }
    }

    const onBlur = ({ value }) => {
        setUnsavedComment(cellId, value)
    }

    const cancel = () => {
        closeEditor()
        deleteUnsavedComment(cellId)
    }

    return (
        <ExpandableUnit title={title} open={open} onToggle={setOpen}>
            <Form onSubmit={onSubmit}>
                {({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <CommentEditField
                            fieldName={fieldName}
                            comment={item?.comment}
                            commentOptionSetId={item?.commentOptionSetId}
                            onBlur={onBlur}
                            unsavedComment={unsavedComment}
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
                                onClick={cancel}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                        </ButtonStrip>
                    </form>
                )}
            </Form>
            {isError && (
                <div className={styles.errorWrapper}>
                    <LoadingError title={errorMessage} />
                </div>
            )}
        </ExpandableUnit>
    )
}

CommentEditForm.propTypes = {
    closeEditor: PropTypes.func.isRequired,
    commentId: PropTypes.string.isRequired,
    item: PropTypes.shape({
        categoryOptionCombo: PropTypes.string.isRequired,
        dataElement: PropTypes.string.isRequired,
        comment: PropTypes.string,
        commentOptionSetId: PropTypes.string,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    syncComment: PropTypes.func.isRequired,
    isError: PropTypes.bool,
    unsavedComment: PropTypes.string,
}

export default function Comment({ item }) {
    const canUserEditFields = useCanUserEditFields()
    const { locked } = useLockedContext()
    const [open, setOpen] = useState(true)
    const [editing, setEditing] = useState(false)
    const setDataValueComment = useSetDataValueMutation({
        deId: item.dataElement,
        cocId: item.categoryOptionCombo,
    })
    const contextSelectionId = useContextSelectionId()
    const commentId = getCellId({ contextSelectionId, item })
    const unsavedComment = useUnsavedDataStore((state) =>
        state.getUnsavedComment(commentId)
    )

    useEffect(() => {
        setEditing(false)
    }, [item])

    if (editing || unsavedComment) {
        return (
            <CommentEditForm
                item={item}
                open={open}
                setOpen={setOpen}
                syncComment={setDataValueComment.mutateAsync}
                closeEditor={() => setEditing(false)}
                unsavedComment={unsavedComment}
                commentId={commentId}
                isError={setDataValueComment.isError}
            />
        )
    }

    const addEditButton = (
        <Button
            small
            secondary
            onClick={() => setEditing(true)}
            disabled={!canUserEditFields || locked}
        >
            {item.comment ? i18n.t('Edit comment') : i18n.t('Add comment')}
        </Button>
    )

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

            {!canUserEditFields && (
                <Tooltip
                    content={i18n.t(
                        'You do not have the authority to add or edit comments'
                    )}
                >
                    {addEditButton}
                </Tooltip>
            )}

            {canUserEditFields && addEditButton}
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
