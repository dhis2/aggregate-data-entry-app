import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, NoticeBox } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import React, { useState, useEffect } from 'react'
import {
    Sidebar,
    Title,
    SidebarProps,
    useDataValueSetQueryKey,
    useValueStore,
    useIsFirstRender,
    useValidationResult,
    useValidationStore,
} from '../../shared/index.js'
import ValidationCommentsViolations from './validation-comments-violations.js'
import { validationLevels } from './validation-config.js'
import ValidationPriortyGroup from './validation-priority-group.js'
import styles from './validation-results-sidebar.module.css'
import ValidationSummaryBox from './validation-summary-box.js'

export default function ValidationResultsSidebar({ hide }) {
    const [dataChangedSinceValidation, setDataChangedSinceValidation] =
        useState(false)
    const dataValues = useValueStore((state) => state.getDataValues())
    const isFirstRender = useIsFirstRender()

    useEffect(() => {
        if (!isFirstRender) {
            setDataChangedSinceValidation(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataValues])

    const {
        isLoading,
        isRefetching,
        error,
        data: { validationRuleViolations, commentRequiredViolations } = {},
        refetch,
    } = useValidationResult()
    const showLoader = isLoading || isRefetching

    const shouldValidationRefresh = useValidationStore((store) =>
        store.getValidationToRefresh()
    )
    const setValidationToRefresh = useValidationStore(
        (store) => store.setValidationToRefresh
    )

    useEffect(() => {
        if (shouldValidationRefresh) {
            refetch()
            setValidationToRefresh(false)
        }
    }, [refetch, shouldValidationRefresh, setValidationToRefresh])

    const queryKey = useDataValueSetQueryKey()
    const activeMutations = useIsMutating({
        mutationKey: queryKey,
    })

    const hasRunningMutations = activeMutations > 0

    const hasCommentsViolations = Boolean(commentRequiredViolations?.length)

    const isEmpty =
        validationRuleViolations &&
        Object.values(validationRuleViolations).every(
            (ruleViolations) => ruleViolations.length === 0
        ) &&
        !hasCommentsViolations

    const rerunValidation = () => {
        setDataChangedSinceValidation(false)
        refetch()
    }
    return (
        <Sidebar>
            <Title onClose={hide}>{i18n.t('Validation')}</Title>

            <div className={styles.wrapper}>
                {dataChangedSinceValidation && (
                    <div className={styles.dataChangedNotice}>
                        <NoticeBox title="Data has changed since validation was run">
                            {i18n.t(
                                'Data in the entry form has changed, so validation output might be incorrect. Run validation again to check the current data.'
                            )}
                        </NoticeBox>
                    </div>
                )}
                <div className={styles.buttons}>
                    <Button
                        disabled={showLoader || hasRunningMutations}
                        small
                        onClick={rerunValidation}
                    >
                        {i18n.t('Run validation again')}
                    </Button>
                </div>
                <h1 className={styles.title}>{i18n.t('Alert summary')}</h1>
                <div className={styles.summaryBoxes}>
                    {validationLevels.map((level) => {
                        return (
                            <ValidationSummaryBox
                                key={level}
                                level={level}
                                count={
                                    validationRuleViolations?.[level]?.length ||
                                    0
                                }
                                hideCounts={Boolean(showLoader || error)}
                            />
                        )
                    })}
                </div>

                {!showLoader &&
                    validationLevels.map((level) => {
                        return (
                            <ValidationPriortyGroup
                                key={level}
                                level={level}
                                validationViolations={
                                    validationRuleViolations?.[level]
                                }
                            />
                        )
                    })}
                {!showLoader && isEmpty && (
                    <div className={styles.noAlerts}>
                        {i18n.t('No validation alerts for this data.')}
                    </div>
                )}
                {showLoader && (
                    <div className={styles.loading}>
                        <CircularLoader small />
                        <span className={styles.text}>
                            {i18n.t('Running validation...')}
                        </span>
                    </div>
                )}
                {!showLoader && error && (
                    <NoticeBox
                        error
                        title={i18n.t('There was a problem running validation')}
                    >
                        {i18n.t(
                            'Validation could not be run for this data. Try again or contact your system administrator.'
                        )}
                    </NoticeBox>
                )}
                {/* @todo: temporary UI for showing comments until we have a design provided */}
                {!showLoader && hasCommentsViolations && (
                    <ValidationCommentsViolations
                        commentRequiredViolations={commentRequiredViolations}
                    />
                )}
            </div>
        </Sidebar>
    )
}

ValidationResultsSidebar.propTypes = SidebarProps
