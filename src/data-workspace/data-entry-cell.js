import { useDataMutation } from '@dhis2/app-runtime/build/cjs'
import { IconMore16, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Form, useField } from 'react-final-form'
import styles from './data-entry-cell.module.css'

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
    const inputStateClassName = meta.invalid
        ? styles.inputInvalid
        : synced
        ? styles.inputSynced
        : null

    return (
        <td className={styles.dataEntryCell}>
            <div className={styles.cellInnerWrapper}>
                <input
                    className={cx(styles.input, inputStateClassName)}
                    type="text"
                    {...input}
                    onBlur={onBlur}
                    // todo: disabled if 'readOnly'
                    // disabled={true}
                />
                <div className={styles.topRightIndicator}>
                    {loading ? (
                        <IconMore16 color={colors.grey700} />
                    ) : synced ? (
                        <div className={styles.topRightTriangle} />
                    ) : null}
                </div>
                <div className={styles.bottomLeftIndicator}>
                    {/* todo: show grey600 6x6 triangle if there is a comment */}
                    {false && <div className={styles.bottomLeftTriangle} />}
                </div>
            </div>
        </td>
    )
}
DataEntryCell.propTypes = {
    categoryOptionCombo: PropTypes.shape({ id: PropTypes.string.isRequired })
        .isRequired,
    dataElement: PropTypes.shape({ id: PropTypes.string.isRequired })
        .isRequired,
}
