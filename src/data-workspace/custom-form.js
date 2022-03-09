import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import parse from 'html-react-parser'
import PropTypes from 'prop-types'
import React from 'react'
import useCustomForm from '../custom-forms/use-custom-form.js'
import { getDataElementById } from '../metadata/selectors.js'
import { useMetadata } from '../metadata/use-metadata.js'
import { DataEntryCell } from './data-entry-cell/data-entry-cell.js'

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

    const getInputType = () => {}
    const getCellPropsByInputType = () => {}

    const renderForm = (htmlCode) => {
        return parse(htmlCode, {
            replace: (domNode) => {
                // Replace inputs
                if (domNode.name !== 'input') {
                    return
                }
                console.log({ domNode })
                
                // Different types:
                const inputType = getInputType(domNode)
                const cellProps = getCellPropsByInputType(inputType)

                const [deId, cocId] = domNode.attribs.id.split('-')
                const de = getDataElementById(metadata, deId)

                // todo: handle read-only
                return (
                    <DataEntryCell
                        dataElement={de}
                        categoryOptionCombo={{ id: cocId }}
                    />
                )
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
