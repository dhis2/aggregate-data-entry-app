import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Form } from 'react-final-form'

function mapObject(input, callback) {
    return Object.fromEntries(Object.entries(input).map(callback))
}

// Could this instead reuse `mapDataValuesToForm(Initial)Values` in `use-data-value-set.js`?
// Returns an object in the form of `{ [deId]: { [cocId]: value } }` for Final Form
function createInitialValues(dataValueSet) {
    // dataValueSet can be undefined when offline
    if (!dataValueSet) {
        return {}
    }

    return mapObject(dataValueSet, ([deId, dataElement]) => [
        deId,
        mapObject(dataElement, ([cocId, { value }]) => [cocId, value]),
    ])
}

const onSubmit = (values, form) => console.log({ values, form })

const subscriptions = {}

export function FinalFormWrapper({ children, dataValueSet }) {
    const [initialValues] = useState(() => createInitialValues(dataValueSet))

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            subscriptions={subscriptions}
            keepDirtyOnReinitialize
        >
            {() => children}
        </Form>
    )
}
FinalFormWrapper.propTypes = {
    children: PropTypes.node,
    dataValueSet: PropTypes.object,
}
