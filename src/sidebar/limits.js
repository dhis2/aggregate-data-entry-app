import { useDataQuery, useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    NoticeBox,
    Button,
    ButtonStrip,
    ReactFinalForm,
    InputFieldFF,
    IconInfo16,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styles from './limits.module.css'
import ToggleableUnit from './toggleable-unit.js'

// TODO
const query = {
    limits: {
        resource: 'limits',
        id: ({ id }) => id,
    },
}

// TODO
const updateMutation = {}
const deleteMutation = {}

const Limits = ({ itemId }) => {
    const [editing, setEditing] = useState(false)
    const { called, loading, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const fetchLimits = () => {
        setEditing(false)
        refetch({ id: itemId })
    }
    const errorAlert = useAlert(({ message }) => message, { critical: true })
    const [updateLimits] = useDataMutation(updateMutation, {
        onError: () =>
            errorAlert.show({
                message: i18n.t(
                    'There was a problem saving the data item limits.'
                ),
            }),
        onComplete: fetchLimits,
    })
    const [deleteLimits, { loading: deletingLimits }] = useDataMutation(
        deleteMutation,
        {
            onError: () =>
                errorAlert.show({
                    message: i18n.t(
                        'There was a problem deleting the data item limits.'
                    ),
                }),
            onComplete: fetchLimits,
        }
    )
    const deleteLimitsButton = (
        <Button
            small
            secondary
            onClick={() => deleteLimits({ id: itemId })}
            loading={deletingLimits}
        >
            {i18n.t('Delete limits')}
        </Button>
    )

    useEffect(fetchLimits, [itemId])

    if (!called || loading) {
        return <CircularLoader small />
    }

    if (error) {
        return (
            <NoticeBox
                error
                title={i18n.t(
                    'There was a problem loading the limits for this data item'
                )}
            >
                {i18n.t('Try again, or contact your system administrator')}
            </NoticeBox>
        )
    }

    const { avg, min, max } = data.limits
    const averageValueInfo = (
        <div className={styles.averageValue}>
            <IconInfo16 color={colors.grey600} />
            {i18n.t('Average value: {{avg}}', { avg, nsSeparator: '-:-' })}
        </div>
    )

    if (editing) {
        return (
            <ReactFinalForm.Form
                onSubmit={({ min, max }) =>
                    updateLimits({ id: itemId, min, max })
                }
            >
                {({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        {averageValueInfo}
                        <div className={styles.limits}>
                            <ReactFinalForm.Field
                                name="min"
                                label={i18n.t('Minimum')}
                                component={InputFieldFF}
                                className={styles.input}
                                initialValue={min}
                                dense
                            />
                            <div className={styles.spaceBetween}></div>
                            <ReactFinalForm.Field
                                name="max"
                                label={i18n.t('Maximum')}
                                component={InputFieldFF}
                                className={styles.input}
                                initialValue={max}
                                dense
                            />
                        </div>
                        <ButtonStrip>
                            <Button
                                small
                                primary
                                type="submit"
                                loading={submitting}
                            >
                                {submitting
                                    ? i18n.t('Saving...')
                                    : i18n.t('Save limits')}
                            </Button>
                            <Button
                                small
                                secondary
                                onClick={() => setEditing(false)}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            {deleteLimitsButton}
                        </ButtonStrip>
                    </form>
                )}
            </ReactFinalForm.Form>
        )
    }

    return (
        <>
            {averageValueInfo}
            {min === null && max === null ? (
                <>
                    <div className={styles.placeholder}>
                        {i18n.t('No limits set for this data item.')}
                    </div>
                    <Button small secondary onClick={() => setEditing(true)}>
                        {i18n.t('Add limits')}
                    </Button>
                </>
            ) : (
                <>
                    <div className={styles.limits}>
                        {min !== null && (
                            <div className={styles.limit}>
                                <span className={styles.limitLabel}>
                                    {i18n.t('Minimum')}
                                </span>
                                <span className={styles.limitValue}>{min}</span>
                            </div>
                        )}
                        {min !== null && max !== null && (
                            <div className={styles.spaceBetween}></div>
                        )}
                        {max !== null && (
                            <div className={styles.limit}>
                                <span className={styles.limitLabel}>
                                    {i18n.t('Maximum')}
                                </span>
                                <span className={styles.limitValue}>{max}</span>
                            </div>
                        )}
                    </div>
                    <ButtonStrip>
                        <Button
                            small
                            secondary
                            onClick={() => setEditing(true)}
                        >
                            {i18n.t('Edit limits')}
                        </Button>
                        {deleteLimitsButton}
                    </ButtonStrip>
                </>
            )}
        </>
    )
}

Limits.propTypes = {
    itemId: PropTypes.string.isRequired,
}

const LimitsUnit = ({ itemId, disabled }) => (
    <ToggleableUnit
        title={i18n.t('Minimum and maximum limits')}
        disabled={disabled}
    >
        <Limits itemId={itemId} />
    </ToggleableUnit>
)

LimitsUnit.propTypes = {
    itemId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
}

export default LimitsUnit
