import PropTypes from 'prop-types'
import React from 'react'
import { Form } from 'react-final-form'

function mapObject(input, callback) {
    return Object.fromEntries(Object.entries(input).map(callback))
}

// Could this instead reuse `mapDataValuesToForm(Initial)Values` in `use-data-value-set.js`?
// Returns an object in the form of `{ [deId]: { [cocId]: value } }` for Final Form
function createInitialValues(dataValueSet) {
    // dataValueSet can be undefined when offline
    return dataValueSet
        ? mapObject(dataValueSet, ([deId, dataElement]) => {
              return [
                  deId,
                  mapObject(dataElement, ([cocId, { value }]) => [
                      cocId,
                      value,
                  ]),
              ]
          })
        : {}
}

export function FinalFormWrapper({ children, dataValueSet }) {
    const initialValues = createInitialValues(dataValueSet)
    return (
        <Form
            onSubmit={(values, form) => {
                console.log({ values, form })
            }}
            initialValues={initialValues}
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
