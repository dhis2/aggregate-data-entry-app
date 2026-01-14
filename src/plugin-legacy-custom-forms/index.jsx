import { useAlert, useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import getBaseExternalFiles from './get-base-external-files.js'
import loadCustomFormShim from './load-form-shim.js'
import parseFormContent from './parse-form-content.js'
import '../locales/index.js'

const { externalCSS, externalScripts } = getBaseExternalFiles()

const LegacyCustomFormPlugin = React.memo(function LegacyCustomFormPlugin(
    props
) {
    /* 
    This is what get passed from data-entry app and effectively the contract for custom form plugins (legacy or not)
    */
    const {
        htmlCode,
        // initialValues,
        metadata,
        // dataSet,
        saveValue,
        periodId,
        dataSetId,
        orgUnitId,
        attributeOptionComboSelection,
        setHighlightedField,
        showDetailsBar,
        fileHelper,
    } = props

    console.log('[custom-forms] 🏁 Legacy Custom Form Plugin starting 🏁')

    const config = useConfig()

    // * Load the htmlCode into a doc to allow manipulating it
    const doc = new DOMParser().parseFromString(htmlCode, 'text/html')
    const parsedContent = parseFormContent(doc)

    // * Extracting the form's HTML, JS scripts and CSS
    // The HTML would end up set as the plugin content as it is
    // The JS and CSS are manipulated first to ensure they're loaded after the base styles and scripts (the ones that were part of  the Struts templates in DHIS2 pre-41 by default)
    const formHtml = doc.body.innerHTML
    const formScripts = parsedContent.scripts
    const formStyles = parsedContent.styles

    // * The shim will proxy the legacy setHeaderDelayMessage that was used to show alerts to the modern AlertBar stack
    const { show: showAlert, hide: hideAlert } = useAlert(
        (options) => options?.message ?? options,
        (options) => options?.alertOptions ?? { warning: true }
    )

    useEffect(() => {
        if (!htmlCode || !formStyles || !formScripts) {
            return
        }

        // ! Order matters
        // 1. load external JS first (jquery etc..)
        // 2. Append external CSS (jQuery UI, old data-entry styles etc..)
        // 3. Append inline styles that comes from the form itself
        // 4. Load the shim
        // 5. Load JS scripts from the form itself
        document.body.append(...externalScripts)
        const head = document.getElementsByTagName('head')[0]
        head.append(...externalCSS, ...formStyles)

        // ! loading the shim needs to be delayed in order to ensure that the base scripts (jquery et al.) are loaded first.
        // * That order was implicit in the old Struts app, but it's not easy to guarantee in the React realm
        // ToDo: research a better less-hacky way to control the order of loading external scripts
        setTimeout(() => {
            loadCustomFormShim({
                periodId,
                dataSetId,
                attributeOptionComboSelection,
                baseUrl: config?.systemInfo?.contextPath,
                scripts: formScripts,
                metadata,
                orgUnitId,
                hideAlert,
                showAlert,
                setHighlightedField,
                saveValue,
                showDetailsBar,
                fileHelper,
            })

            // * appending the scripts that are part of the custom form at the end
            // * (after jQuery and dhis2 utils and the shim objects are loaded as they often depend on those)
            document.body.append(...formScripts)

            //! Kick off everything 🚀
            window.dhis2?.de?.loadForm()
        }, 1000)
    }, [
        config?.systemInfo?.contextPath,
        dataSetId,
        hideAlert,
        htmlCode,
        metadata,
        metadata.dataSets,
        orgUnitId,
        formScripts,
        periodId,
        showAlert,
        formStyles,
        attributeOptionComboSelection,
        setHighlightedField,
        saveValue,
        showDetailsBar,
        fileHelper,
    ])

    return (
        <div>
            <div>
                <div
                    // ? the parent style in old Struts world - do we keep it?
                    className="cde-NORMAL"
                    dangerouslySetInnerHTML={{ __html: formHtml }}
                ></div>
            </div>
        </div>
    )
})

LegacyCustomFormPlugin.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    htmlCode: PropTypes.string.isRequired,
    orgUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
    attributeOptionComboSelection: PropTypes.object,
    dataSet: PropTypes.shape({ displayName: PropTypes.string }),
    fileHelper: PropTypes.object,
    initialValues: PropTypes.shape({}),
    metadata: PropTypes.object,
    saveValue: PropTypes.func,
    setHighlightedField: PropTypes.func,
    showDetailsBar: PropTypes.func,
}
export default LegacyCustomFormPlugin
