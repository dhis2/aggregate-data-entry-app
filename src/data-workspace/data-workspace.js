import { CircularLoader } from '@dhis2/ui'
import React from 'react'
import { useContextSelection } from '../context-selection/index.js'
import { useMetadata as useMetadataContext } from '../metadata/index.js'
import { FinalFormWrapper } from './data-entry-cell/index.js'
import styles from './data-workspace.module.css'
import { EntryForm } from './entry-form.js'
import { useAttributeOptionCombo } from './use-attribute-option-combo.js'
import { useDataSet } from './use-data-set.js'
import { useDataValueSet } from './use-data-value-set.js'
import { useMetadata } from './use-metadata.js'

// Form value object structure: { [dataElementId]: { [cocId]: value } }
function mapDataValuesToFormInitialValues(dataValues) {
    const formInitialValues = dataValues.reduce(
        (acc, { dataElement, categoryOptionCombo, value }) => {
            if (!acc[dataElement]) {
                acc[dataElement] = { [categoryOptionCombo]: value }
            } else {
                acc[dataElement][categoryOptionCombo] = value
            }
            return acc
        },
        {}
    )
    return formInitialValues
}

export const DataWorkspace = () => {
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const attributeOptionComboId = useAttributeOptionCombo()
    const dataSetFetch = useDataSet()
    const dataValueSetFetch = useDataValueSet()
    const { available } = useMetadataContext()

    useMetadata()

    if (!dataSetId || !orgUnitId || !periodId || !attributeOptionComboId) {
        return null
    }

    if (!available || dataSetFetch.isLoading || dataValueSetFetch.isLoading) {
        return <CircularLoader />
    }

    if (dataSetFetch.error) {
        return 'Error!'
    }

    return (
        <div className={styles.wrapper}>
            <FinalFormWrapper
                initialValues={mapDataValuesToFormInitialValues(
                    dataValueSetFetch.data.dataValueSet.dataValues
                )}
            >
                <EntryForm dataSet={dataSetFetch.data.dataSet} />
            </FinalFormWrapper>
        </div>
    )
}
