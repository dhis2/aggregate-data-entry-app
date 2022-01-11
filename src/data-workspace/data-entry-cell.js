import { useDataMutation } from '@dhis2/app-runtime/build/cjs'
import { TableCell, colors, theme, IconMore16 } from '@dhis2/ui'
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
    cp: 'JvIqWKLPPkt', // Attribute option _LIST_: Result (should be ';'-separated)
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

const { className: cellClassName, styles: cellResolvedStyles } = css.resolve`
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

const styles = css`
    input {
        width: 100%;
        height: 100%;
        background: none;
        border: none;
        padding: 8px 16px 8px 8px;
    }
    input.readOnly {
        background: ${colors.grey300};
    }
    input:hover:not(.readOnly) {
        outline: 1px solid #a0adba;
    }

    input.invalid {
        background: ${colors.red200};
        border: 1px solid ${colors.red600};
    }
    input.invalid:hover {
        background: #ffb3bc;
    }

    input.synced {
        background: ${colors.green050};
    }
    input.synced:hover {
        background: #d8eeda;
    }

    input:focus-visible {
        outline: 3px solid ${theme.focus} !important;
        border: none !important;
        background: #fff !important;
    }

    .topRightIndicator {
        position: absolute;
        top: 0;
        right: 0;
    }
    .bottomLeftIndicator {
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .topRightTriangle {
        width: 0;
        height: 0;
        border-top: 3px solid ${colors.green300};
        border-right: 3px solid ${colors.green300};
        border-bottom: 3px solid transparent;
        border-left: 3px solid transparent;
    }
    .bottomLeftTriangle {
        width: 0;
        height: 0;
        border-top: 3px solid transparent;
        border-right: 3px solid transparent;
        border-bottom: 3px solid ${colors.grey600};
        border-left: 3px solid ${colors.grey600};
    }

    .cellWrapper {
        width: 100%;
        height: 100%;
        position: relative;
    }
`

export function DataEntryCell({ dataElement: de, categoryOptionCombo: coc }) {
    // This field name results in this structure for the form data object:
    // { [deId]: { [cocId]: value } }
    const { input, meta } = useField(`${de.id}.${coc.id}`)

    const [mutate, { called, loading, error }] =
        useDataMutation(DATA_VALUE_MUTATION)

    // todo: get org unit, period, dataSetId and attribute combo & option combo from context
    const mutationVars = {
        ...dummyQueryParams,
        de: de.id,
        co: coc.id,
    }

    const onBlur = (event) => {
        // todo: also check if 'valid'
        // If this value has changed from its initial value
        if (!meta.pristine) {
            // Send mutation to autosave data
            mutate({ ...mutationVars, value: input.value })
        }
        // Also invoke FinalForm's `onBlur`
        input.onBlur(event)
    }

    // todo: get data details (via getDataValue?)
    // todo: on focus, set 'active cell' in context
    // todo: handle key presses (arrows, tab, enter) and double-click
    // todo: tooltip for invalid cells
    // todo: validate with `de.valueType`
    // todo: other input types for different value types
    // todo: implement read-only cells

    const synced = meta.valid && called && !loading && !error
    const inputState = meta.invalid
        ? 'invalid'
        : synced
        ? 'synced'
        : null

    return (
        <TableCell className={cx('dataEntryCell', cellClassName)}>
            <div className="cellWrapper">
                <input
                    className={inputState}
                    type="text"
                    {...input}
                    onBlur={onBlur}
                />
                <div className="topRightIndicator">
                    {loading ? (
                        <IconMore16 color={colors.grey700} />
                    ) : synced ? (
                        <div className="topRightTriangle" />
                    ) : null}
                </div>
                <div className="bottomLeftIndicator">
                    {/* todo: show grey600 6x6 triangle if there is a comment */}
                    {false && <div className="bottomLeftTriangle" />}
                </div>
            </div>
            <style jsx>{styles}</style>
            {cellResolvedStyles}
        </TableCell>
    )
}
DataEntryCell.propTypes = {
    categoryOptionCombo: PropTypes.shape({ id: PropTypes.string.isRequired })
        .isRequired,
    dataElement: PropTypes.shape({ id: PropTypes.string.isRequired })
        .isRequired,
}
