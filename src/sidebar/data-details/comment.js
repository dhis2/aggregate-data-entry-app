import { useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    Button,
    ButtonStrip,
    ReactFinalForm,
    TextAreaFieldFF,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ToggleableUnit from '../toggleable-unit.js'
import styles from './comment.module.css'
import LoadingError from './loading-error.js'

// TODO
const mutation = {}

export default function CommentUnit({ comment }) {
    const [editing, setEditing] = useState(false)

    const errorAlert = useAlert(
        i18n.t('There was a problem saving the data item comment.'),
        { critical: true }
    )

    //
    // eslint-disable-next-line no-unused-vars
    const [updateComment, { loading, error }] = useDataMutation(mutation, {
        onError: () => errorAlert.show(),
    })

    if (loading) {
        return <CircularLoader small />
    }

    if (error) {
        return (
            <LoadingError
                title={i18n.t(
                    'There was a problem loading the comment for this data item'
                )}
            />
        )
    }

    if (editing) {
        return (
            <ReactFinalForm.Form
                // updateComment({ id: itemId, comment })
                onSubmit={console.log}
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
                                disabled={submitting}
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

    return (
        <ToggleableUnit title={i18n.t('Comment')} initiallyOpen>
            <p className={comment ? styles.comment : styles.placeholder}>
                {comment ? comment : i18n.t('No comment for this data item.')}
            </p>
            <Button small secondary onClick={() => setEditing(true)}>
                {comment ? i18n.t('Edit comment') : i18n.t('Add comment')}
            </Button>
        </ToggleableUnit>
    )
}

CommentUnit.propTypes = {
    comment: PropTypes.string,
}
