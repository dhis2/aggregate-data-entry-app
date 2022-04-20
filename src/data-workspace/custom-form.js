// import i18n from '@dhis2/d2-i18n'
// import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import HtmlReport from './custom-form/custom-form-iframe.js'
import { processedHtml } from './custom-form/mock-processed-html.js'

export const CustomForm = () => <HtmlReport html={processedHtml} />
