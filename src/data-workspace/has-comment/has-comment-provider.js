import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import { getFieldId } from '../get-field-id.js'
import { HasCommentContext } from './has-comment-context.js'

export const createCommentLookupFromDataSetValues = (dataSetValues) =>
    Object.values(dataSetValues).reduce((lookup, dataElementCocs) => {
        for (const [
            categoryOptionComboId,
            { dataElement: dataElementId, comment },
        ] of Object.entries(dataElementCocs)) {
            if (comment) {
                lookup.add(getFieldId(dataElementId, categoryOptionComboId))
            }
        }
        return lookup
    }, new Set())

export default function HasCommentProvider({ children }) {
    const [lookup, setLookup] = useState(new Set())

    const populateHasCommentContextForDataSetValues = useCallback(
        (dataSetValues) => {
            // Make sure to trigger a re-render when new dataSetValues are received
            // because the cells are not updated otherwise
            setLookup(createCommentLookupFromDataSetValues(dataSetValues))
        },
        []
    )

    const updateHasCommentContext = useCallback(
        (dataElementId, categoryOptionComboId, comment) => {
            const fieldname = getFieldId(dataElementId, categoryOptionComboId)

            // Just mutate the exiting Set here, because adding/editing a comment
            // will cause the cells to update anyway
            if (comment) {
                lookup.add(fieldname)
            } else {
                lookup.delete(fieldname)
            }
        },
        [lookup]
    )

    const hasComment = useCallback(
        (fieldname) => lookup.has(fieldname),
        [lookup]
    )

    const value = {
        populateHasCommentContextForDataSetValues,
        updateHasCommentContext,
        hasComment,
    }

    return (
        <HasCommentContext.Provider value={value}>
            {children}
        </HasCommentContext.Provider>
    )
}

HasCommentProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
