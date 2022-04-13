import parse from 'html-react-parser'
import PropTypes from 'prop-types'
import React from 'react'
import useCustomForm from '../custom-forms/use-custom-form.js'
import { getDataElementById } from '../metadata/selectors.js'
import { useMetadata } from '../metadata/use-metadata.js'
import { DataEntryField } from './data-entry-cell/index.js'

const INPUT_TYPES = {
    ENTRYFIELD: 'ENTRYFIELD',
    INDICATOR: 'INDICATOR',
    TOTAL: 'TOTAL',
}

export const CustomForm = ({ dataSet }) => {
    const { data: customForm } = useCustomForm({
        id: dataSet.dataEntryForm.id,
        version: dataSet.version,
    })
    const { data: metadata } = useMetadata()

    const getInputType = (domNode) => {
        console.log({
            domNode,
            name: domNode.attribs.name,
            id: domNode.attribs.id,
        })
        const { attribs } = domNode
        if (attribs.id.startsWith('total')) {
            return INPUT_TYPES.TOTAL
        }
        if (attribs.id.startsWith('indicator')) {
            return INPUT_TYPES.INDICATOR
        } else {
            // id is in the format `${deId}-${cocId}-val`
            const [deId, cocId, val] = attribs.id.split('-')
            if (deId && cocId && val === 'val') {
                return INPUT_TYPES.ENTRYFIELD
            }
        }
    }
    // const getCellPropsByInputType = () => {}

    const renderForm = (htmlCode) => {
        return parse(htmlCode, {
            replace: (domNode) => {
                // Only check inputs
                if (domNode.name !== 'input') {
                    return
                }

                const inputType = getInputType(domNode)
                // const cellProps = getCellPropsByInputType(inputType)

                if (inputType === INPUT_TYPES.ENTRYFIELD) {
                    const [deId, cocId] = domNode.attribs.id.split('-')
                    const dataElement = getDataElementById(metadata, deId)
                    return (
                        <DataEntryField
                            dataElement={dataElement}
                            categoryOptionCombo={{ id: cocId }}
                        />
                    )
                }
            },
        })
    }

    return customForm ? renderForm(customForm.htmlCode) : null
}
CustomForm.propTypes = {
    dataSet: PropTypes.shape({
        dataEntryForm: PropTypes.shape({
            id: PropTypes.string,
        }),
        version: PropTypes.number,
    }),
}
