import { Plugin, useDataEngine } from '@dhis2/app-runtime'
import { useMutation } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import React from 'react'
import useCustomForm from '../../custom-forms/use-custom-form.js'
import {
    useContextSelection,
    useMetadata,
    useValueStore,
} from '../../shared/index.js'
import styles from './custom-form.module.css'
import { parseHtmlToReact } from './parse-html-to-react.js'

/**
 * This implementation of custom forms only supports custom
 * HTML and CSS. It does not support custom logic (JavaScript).
 * For more info see ./docs/custom-froms.md
 */
export const CustomForm = ({ dataSet }) => {
    const { data: customForm } = useCustomForm({
        id: dataSet.dataEntryForm.id,
        version: dataSet.version,
    })

    const getDataValues = useValueStore((state) => state.getDataValues)
    const initialDataValues = getDataValues()

    const { data: metadata } = useMetadata()
    const engine = useDataEngine()
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()

    const mutationClient = useMutation({
        mutationFn: (variables) => {
            return engine.mutate(
                {
                    resource: 'dataValues',
                    type: 'create',
                    data: (data) => data,
                },
                {
                    variables,
                    onComplete: () => {
                        // ToDo: maybe there is a way to update the client cache here?
                    },
                }
            )
        },
        networkMode: 'online',
    })

    /* 
    
    
    */
    /**
     * saveMutation - an imperative saveMutation method
     *
     * the declarative style we use in the app is tied to each field and is hard (impossible?) to pass to the plugin
     *
     * @param {*} valueToSave an object  {deId: dataElementId, cocId: categoryOptionId, value: valueToSave }
     */
    const saveMutation = async (valueToSave) => {
        const { deId, cocId, value } = valueToSave

        const dataValueParams = {
            de: deId,
            co: cocId,
            ds: dataSetId,
            ou: orgUnitId,
            pe: periodId,
            value,
        }

        // ToDo: do optimistic update and stuff?
        return mutationClient.mutateAsync(dataValueParams)
    }

    /*
        displaying both versions of the form for now: the new "sanitised" way of rendering the custom form (the plugin way)
    */
    return customForm ? (
        <>
            <div style={{ height: '100vh', width: '100%' }}>
                <Plugin
                    pluginSource="http://localhost:3002/plugin.html"
                    htmlCode={customForm.htmlCode}
                    initialValues={initialDataValues}
                    metadata={metadata}
                    dataSet={dataSet}
                    saveValue={saveMutation}
                />
            </div>
            <div className={styles.customForm}>
                {parseHtmlToReact(customForm.htmlCode, metadata)}
            </div>
        </>
    ) : null
}

CustomForm.propTypes = {
    dataSet: PropTypes.shape({
        dataEntryForm: PropTypes.shape({
            id: PropTypes.string,
        }),
        version: PropTypes.number,
    }),
}
