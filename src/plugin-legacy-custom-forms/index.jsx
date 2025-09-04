import { useAlert, useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import getCustomFormShim from './custom-form-shim.js'
import externalCSS from './external-css.js'
import externalScripts from './external-scripts.js'

const LegacyCustomFormPlugin = (props) => {
    /* 
    This is what get passed from data-entry app and effectively the contract for custom form plugins (legacy or not)
    */
    const {
        htmlCode,
        // initialValues,
        metadata,
        dataSet,
        // saveValue,
        periodId,
        dataSetId,
        orgUnitId,
    } = props

    console.log('[custom-forms] Plugin starting (plugin-wrapper.jsx)')

    const config = useConfig()

    // Load the htmlCode into a doc to allow manipulating it
    const doc = new DOMParser().parseFromString(htmlCode, 'text/html')
    const scriptsFromFrom = doc.getElementsByTagName('script')
    const stylesFromForm = doc.getElementsByTagName('style')

    const originalFormScripts = useMemo(() => {
        const scriptsList = []
        Array.from(scriptsFromFrom).forEach((script) => {
            // * removing the scripts from the form HTML, keeping them in a copy that gets appended at the end
            // * after all base JS is loaded (jQuery etc..)
            const scriptCopy = document.createElement('script')
            scriptCopy.textContent = script.textContent
            scriptCopy.async = false
            scriptsList.push(scriptCopy)
            script.remove()
        })
        return scriptsList
    }, [scriptsFromFrom])

    const { show: showAlert, hide: hideAlert } = useAlert(
        ({ message }) => message,
        { warning: true }
    )

    useEffect(() => {
        if (!htmlCode) {
            return
        }

        const scriptsToAdd = externalScripts.map((scriptFile) => {
            const script = document.createElement('script')
            script.src = scriptFile
            // * making sure that the script are sync to avoid race conditions and to copy the loading behaviour of the struts templates
            script.async = false
            return script
        })

        const head = document.getElementsByTagName('head')[0]

        externalCSS.forEach((cssFile) => {
            // ? what other CSS files we should include? the base CSS from old Struts - would people expect the look to be similar to the old version
            const style = document.createElement('link')
            style.href = cssFile
            style.type = 'text/css'
            style.rel = 'stylesheet'
            head.append(style)
        })

        document.body.append(...scriptsToAdd)
        document.body.append(...stylesFromForm)

        const shim = () =>
            getCustomFormShim({
                periodId,
                dataSetId,
                baseUrl: config.baseUrl,
                originalFormScripts,
                metadata,
                orgUnitId,
                hideAlert,
                showAlert,
            })

        // * loading these values needs to be delayed in order to ensure that the base scripts (jquery et al.) are loaded first.
        // * That order was implicit in the old Struts app, but it's not easy to guarantee in the React realm
        setTimeout(shim, 1000) // ToDo: research a better less-hacky way to control the order of loading external scripts 

        // ! Other todos/notes:
        // ! - expose a loading function
        // ! - update form.js
        // !         - calls to legacy API `x.action`
        // ! - other operations: offline, completing, validation, printing
        // ! - support date fields (and other field types)
        // ! ✅ show error messages with useAlert (proxy setHeaderDelayMessage to useAlert)
        // ! ✅ support inline CSS
        // ! ✅ API requests to relative path: '../api/data....' (handled with jQuery AJAX override)
        // ! ✅ Support custom tabs: a lot of custom tabs with jquery plugins: $( "#tabs" ).tabs();
        // ! ✅ dhis2.de.currentOrganisationUnitId;
        // ! ✅ jquery UI: floatThead, tabs,
        // ? - other global JS:
        // ?    - show/hide loader (/src/main/webapp/dhis-web-commons/javascript    s/commons.js)
        // ? - events  dhis2.util.on(
        // ?        dhis2.de.event.formReady",
        // ?        dhis2.de.event.dataValuesLoaded
        // ?        dhis2.de.event.dataValueSaved
        // ?        dhis2.de.event.completed
        // ? - HTML contracts: IDs to data elements, $('#morb') $('#mort')??, window.location.pathname.indexOf("dataentry")
        // ? - jQuery.getJSON( '../dhis-web-commons-ajax-json/getCategoryOptionCombos.action', {

        /**
         * ! for new custom forms
         * ! - interface for selecting items, similar to: document.querySelector("#hiTm0oSRRRi-HoIsxzhEmia-val");
         *
         */

        // ToDo: what cleanup is needed if any
        // return () => {
        //     document.body.removeChild(script)
        // }
    }, [
        config.baseUrl,
        dataSetId,
        hideAlert,
        htmlCode,
        metadata,
        metadata.dataSets,
        orgUnitId,
        originalFormScripts,
        periodId,
        showAlert,
        stylesFromForm,
    ])

    return (
        <div>
            <div>
                <h3>Legacy Custom Form plugin: {dataSet?.displayName}</h3>
                <div
                    className="cde-NORMAL"
                    dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}
                ></div>
            </div>
        </div>
    )
}

LegacyCustomFormPlugin.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    htmlCode: PropTypes.string.isRequired,
    orgUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
    dataSet: PropTypes.shape({ displayName: PropTypes.string }),
    initialValues: PropTypes.shape({}),
    metadata: PropTypes.object,
}
export default LegacyCustomFormPlugin
