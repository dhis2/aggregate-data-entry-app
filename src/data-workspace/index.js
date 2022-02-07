import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { MetadataContextProvider } from '../metadata/index.js'
import { DataWorkspace as SimpleDataWorkspace } from './data-workspace.js'

export const DataWorkspace = ({ selectionHasNoFormMessage }) => {
    if (selectionHasNoFormMessage) {
        const title = i18n.t('The current selection does not have a form')

        return (
            <NoticeBox title={title}>
                {selectionHasNoFormMessage}
            </NoticeBox>
        )
    }

    return (
        <MetadataContextProvider>
            <SimpleDataWorkspace />
        </MetadataContextProvider>
    )
}

DataWorkspace.propTypes = {
    selectionHasNoFormMessage: PropTypes.string,
}
