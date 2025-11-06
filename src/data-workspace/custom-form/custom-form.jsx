// eslint-disable-next-line import/no-unresolved
import { Plugin } from '@dhis2/app-runtime/experimental' // ToDo: find out why /experimental causes lint and jest issues
import PropTypes from 'prop-types'
import React from 'react'
import useCustomForm from '../../custom-forms/use-custom-form.js'
import {
    useContextSelection,
    useHighlightedFieldStore,
    useMetadata,
    useSetDataValueMutation,
    useValueStore,
} from '../../shared/index.js'

const defaultMutation = {}
/**
 * This implementation of custom forms only supports custom
 * HTML and CSS. It does not support custom logic (JavaScript).
 * For more info see ./docs/custom-froms.md
 */
export const CustomForm = ({ dataSet }) => {
    const { data: customForm } = useCustomForm({
        id: dataSet.id,
        version: dataSet.version,
    })

    const getDataValues = useValueStore((state) => state.getDataValues)
    const initialDataValues = getDataValues()

    const { data: metadata } = useMetadata()
    const [{ dataSetId, orgUnitId, periodId, attributeOptionComboSelection }] =
        useContextSelection()

    const setHighlightedField = useHighlightedFieldStore(
        (state) => state.setHighlightedField
    )

    const { mutate: saveValue } = useSetDataValueMutation(defaultMutation)

    return customForm ? (
        <>
            <Plugin
                width="100%"
                pluginSource="plugin.html"
                htmlCode={customForm.form}
                initialValues={initialDataValues}
                metadata={metadata}
                dataSet={dataSet}
                saveValue={saveValue}
                dataSetId={dataSetId}
                orgUnitId={orgUnitId}
                periodId={periodId}
                attributeOptionComboSelection={attributeOptionComboSelection}
                setHighlightedField={setHighlightedField}
            />
            {/* <div className={styles.customForm}>
                <h2>Existing custom form functionality (for reference)</h2>
                {parseHtmlToReact(customForm.htmlCode, metadata)}
            </div> */}
        </>
    ) : null
}

CustomForm.propTypes = {
    dataSet: PropTypes.shape({
        id: PropTypes.string,
        version: PropTypes.number,
    }),
}
