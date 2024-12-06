import PropTypes from 'prop-types'
import React, { useLayoutEffect, useState } from 'react'
import { useValueStore } from '../shared/index.js'

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

export function FormWrapper({ children, dataValueSet, validFormKey }) {
    // This prevents rerendering on every data value update, but also prevents
    // reinitializing (and populating) an empty form when going back online.
    // TODO: Reinitialize form `onSuccess` of dataValueSets query
    // See https://dhis2.atlassian.net/browse/TECH-1357
    const [initialValues] = useState(() => createInitialValues(dataValueSet))

    const setInitialDataValues = useValueStore(
        (state) => state.setInitialDataValues
    )

    const initialValuesInStore =
        useValueStore((state) => state.getInitialDataValues())?.formKey ===
        validFormKey

    useLayoutEffect(() => {
        if (setInitialDataValues && initialValues && validFormKey) {
            setInitialDataValues(initialValues, validFormKey)
        }
    }, [initialValues, setInitialDataValues, validFormKey])

    if (!initialValuesInStore) {
        return null
    }
    return <>{children}</>
}
FormWrapper.propTypes = {
    children: PropTypes.node,
    dataValueSet: PropTypes.object,
    validFormKey: PropTypes.string,
}
