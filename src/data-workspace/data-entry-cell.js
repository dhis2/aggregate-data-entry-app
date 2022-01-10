import { useDataMutation } from '@dhis2/app-runtime/build/cjs'
import { TableCell, colors, theme } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Form, useField } from 'react-final-form'
import css from 'styled-jsx/css'

// See docs: https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data.html#webapi_sending_individual_data_values
// Taken from old DE app
const dummyQueryParams = {
    de: 'KFnFpbqDqji', // Data element: Children trained on key survival skills
    co: 'HllvX50cXC0', // COC: Default
    ds: 'Lpw6GcnTrmS', // Dataset: Emergency Response (ER)
    ou: 'DiszpKrYNg8', // Org unit: SL / Bo / Badjia / Ngelehun CHC
    pe: '202112', // Period: December 2021
    cc: 'WBW7RjsApsv', // Attribute combo: Target vs Result
    cp: 'JvIqWKLPPkt', // Attribute option combo: Result
    // value: '6',
    // comment: 'optional',
    // followup: 'optional',
}

// ? Q: Params can either be sent as query params or form data, but not JSON (I think).
// ? Is one better?
const DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    params: ({ ...params }) => ({ ...params }),
}

export function FinalFormWrapper({ children, initialValues }) {
    return (
        <Form
            onSubmit={(values, form) => {
                console.log({ values, form })
            }}
            initialValues={initialValues}
        >
            {() => children}
        </Form>
    )
}
FinalFormWrapper.propTypes = {
    children: PropTypes.node,
    initialValues: PropTypes.any,
}

const { className: cellClassName, styles: cellStyles } = css.resolve`
    td.dataEntryCell {
        padding: 0px;
        min-width: 100px;
        border: 1px solid ${colors.grey400};
        background: #fff;
        font-size: 13px;
        line-height: 15px;
        color: ${colors.grey900}
        height: 100%;
    }
`

const inputStyles = css`
    input {
        width: 100%;
        height: 100%;
        background: none;
        border: none;
        padding: 8px 16px 8px 8px;
    }

    input:hover {
        outline: 1px solid #a0adba;
    }

    input:focus-visible {
        outline: 3px solid ${theme.focus};
    }
`

export function DataEntryCell({ deId, cocId }) {
    // This field name results in this structure for the form data object:
    // { [deId]: { [cocId]: value } }
    const { input, meta } = useField(`${deId}.${cocId}`)

    const [mutate] = useDataMutation(DATA_VALUE_MUTATION)

    // todo: get org unit, period, dataSetId and attribute combo & option combo from context
    const mutationVars = {
        ...dummyQueryParams,
        de: deId,
        co: cocId,
    }

    // todo: get data details (via getDataValue?)

    // todo: base styles
    // todo: styles for different states (sending, valid, invalid)
    // todo: other widgets (comments, 'three dots' menu)

    const onBlur = (event) => {
        // If this value has changed from its initial value
        if (!meta.pristine) {
            // Send mutation to autosave data
            mutate({ ...mutationVars, value: input.value })
        }
        // Also invoke FinalForm's `onBlur`
        input.onBlur(event)
    }
    
    // todo: on focus, set 'active cell' in context

    // todo: handle key presses (arrows, tab, enter) and double-click

    // todo: tooltip for invalid cells

    // todo: other input types for different value types

    return (
        <TableCell className={cx('dataEntryCell', cellClassName)}>
            <input type="text" {...input} onBlur={onBlur} />
            <style jsx>{inputStyles}</style>
            {cellStyles}
        </TableCell>
    )
}
DataEntryCell.propTypes = {
    cocId: PropTypes.string.isRequired,
    deId: PropTypes.string.isRequired,
}
