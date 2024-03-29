import i18n from '@dhis2/d2-i18n'
import { Button, colors, IconFlag24, Tooltip } from '@dhis2/ui'
import React from 'react'
import {
    useSetDataValueMutation,
    useCanUserEditFields,
} from '../../shared/index.js'
import ItemPropType from './item-prop-type.js'

const FollowUpButton = ({ item }) => {
    const canUserEditFields = useCanUserEditFields()
    const isEmptyField = !item?.value

    const setDataValueFollowup = useSetDataValueMutation({
        deId: item?.dataElement,
        cocId: item?.categoryOptionCombo,
    })

    const onMarkForFollowUp = async () => {
        await setDataValueFollowup.mutate({ followUp: true })
    }
    const onUnmarkForFollowUp = async () => {
        await setDataValueFollowup.mutate({ followUp: false })
    }

    if (item?.followUp) {
        return (
            <Button small secondary onClick={onUnmarkForFollowUp}>
                {i18n.t('Unmark for follow-up')}
            </Button>
        )
    }

    const disabled = isEmptyField || !canUserEditFields
    const markForFollowUpButton = (
        <Button
            secondary
            icon={<IconFlag24 color={colors.grey600} />}
            onClick={onMarkForFollowUp}
            disabled={disabled}
        >
            {i18n.t('Mark for follow-up')}
        </Button>
    )

    if (isEmptyField) {
        // @ToDo: Having a tooltip around a disabled button doesn't seem to work right now
        // we will have to fix this in dhis/ui and then this should work, or discuss a different solution
        // (same applies for the Add Limits button when the app offline - the tooltip there also doesn't work)
        // https://dhis2.atlassian.net/browse/TECH-1341
        return (
            <Tooltip
                data-testid="custom-element"
                content={i18n.t("Empty values can't be marked for follow -up")}
            >
                {markForFollowUpButton}
            </Tooltip>
        )
    }

    if (!canUserEditFields) {
        return (
            <Tooltip
                content={i18n.t(
                    'You do not have the authority to mark this value for follow -up'
                )}
            >
                {markForFollowUpButton}
            </Tooltip>
        )
    }

    return <>{markForFollowUpButton}</>
}

FollowUpButton.propTypes = {
    item: ItemPropType,
}

export default FollowUpButton
