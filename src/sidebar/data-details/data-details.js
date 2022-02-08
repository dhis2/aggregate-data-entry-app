import { CustomDataProvider } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import AuditLog from './audit-log.js'
import BasicInformation from './basic-information.js'
import Comment from './comment.js'
import ItemPropType from './item-prop-type.js'
import Limits from './limits.js'

const mockData = {
    comment: 'Some comment',
    limits: {
        avg: 238,
        min: 50,
        max: 250,
    },
    auditLog: [
        {
            displayName: 'Firstname Lastname',
            changeType: 'UPDATE',
            newValue: '19',
            oldValue: '13',
            at: new Date('2022-01-01'),
        },
        {
            displayName: 'Firstname Lastname',
            changeType: 'DELETE',
            oldValue: '15',
            at: new Date('2021-10-01'),
        },
    ],
}

const DataDetails = ({ item, onMarkForFollowup, onUnmarkForFollowup }) => (
    // TODO: remove CustomDataProvider
    <CustomDataProvider data={mockData}>
        <BasicInformation
            item={item}
            onMarkForFollowup={onMarkForFollowup}
            onUnmarkForFollowup={onUnmarkForFollowup}
        />
        <Comment itemId={item.id} />
        <Limits itemId={item.id} itemType={item.type} />
        <AuditLog itemId={item.id} />
    </CustomDataProvider>
)

DataDetails.propTypes = {
    item: ItemPropType.isRequired,
    onMarkForFollowup: PropTypes.func.isRequired,
    onUnmarkForFollowup: PropTypes.func.isRequired,
}

export default DataDetails
