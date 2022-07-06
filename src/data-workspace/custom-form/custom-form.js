import PropTypes from 'prop-types'
import React from 'react'
import { useFormState } from 'react-final-form'
import useCustomForm from '../../custom-forms/use-custom-form.js'
import { useMetadata } from '../../metadata/use-metadata.js'
import styles from './custom-form.module.css'
import { parseHtmlToReact } from './parse-html-to-react.js'

/**
 * This implementation of custom forms only supports custom
 * HTML and CSS. It does not support custom logic (JavaScript).
 * For more info see ./docs/custom-froms.md
 */
export const CustomForm = ({ dataSet }) => {
    const formState = useFormState({
        subscription: {
            values: true,
            hasValidationErrors: true,
            errors: true,
        },
    })
    const { data: customForm } = useCustomForm({
        id: dataSet.dataEntryForm.id,
        version: dataSet.version,
    })
    const { data: metadata } = useMetadata()

    return customForm ? (
        <div className={styles.customForm}>
            {parseHtmlToReact(customForm.htmlCode, metadata, formState)}
        </div>
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
