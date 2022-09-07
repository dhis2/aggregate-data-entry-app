import i18n from '@dhis2/d2-i18n'
import { Button, colors, IconFlag24, Tooltip } from '@dhis2/ui'
import React from 'react'
import { useHighlightedField } from '../../shared/index.js'
import { useSetDataValueMutation } from '../data-value-mutations/data-value-mutations.js'
import ItemPropType from './item-prop-type.js'

const FollowUpButton = ({ item }) => {
    const { value } = useHighlightedField()
    const isEmptyField = !value

    const setDataValueFollowup = useSetDataValueMutation({
        deId: item.dataElement,
        cocId: item.categoryOptionCombo,
    })

    const onMarkForFollowUp = async () => {
        await setDataValueFollowup.mutate({ followUp: true })
    }
    const onUnmarkForFollowUp = async () => {
        await setDataValueFollowup.mutate({ followUp: false })
    }

    if (item.followUp) {
        return (
            <Button small secondary onClick={onUnmarkForFollowUp}>
                {i18n.t('Unmark for follow-up')}
            </Button>
        )
    }

    const markForFollowUpButton = (
        <Button
            secondary
            icon={<IconFlag24 color={colors.grey600} />}
            onClick={onMarkForFollowUp}
            disabled={isEmptyField}
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
                content={i18n.t("Empty values can't be marked for follow -up")}
            >
                {markForFollowUpButton}
            </Tooltip>
        )
    }

    return <>{markForFollowUpButton}</>
}
FollowUpButton.propTypes = {
    item: ItemPropType.isRequired,
}

export default FollowUpButton
