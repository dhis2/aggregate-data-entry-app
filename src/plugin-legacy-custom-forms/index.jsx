import { useAlert, useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import getBaseExternalFiles from './get-base-external-files.js'
import loadCustomFormShim from './load-form-shim.js'
import parseFormContent from './parse-form-content.js'

/* 
! Other todos/notes:
- [x] The core: load all JS files defined in the old Struts app, and a shim for commonly used global properties and functions (**ongoing**)
- [x]  support `dhis2.de.currentOrganisationUnitId` and other properties available in `dhis2.de`
- [ ] expose a spinner/loader - _the idea was to use the loader from the new data-entry app, but this is technically difficult as it causes a re-render of the form. Likely we will just support whatever loader the custom form had in the code (i.e. jQuery UI)_
- [ ] update all the `form.js` that are deprecated (i.e. all the calls to `.action` struts routes) (**ongoing**)  
    - [ ] update calls to legacy API `x.action`
    - [ ] jQuery.getJSON( '../dhis-web-commons-ajax-json/getCategoryOptionCombos.action', {
- [ ] other operations: offline, completing, validation, printing
- [ ] support date fields (and other field types)
- [x]  show error messages with useAlert (proxy setHeaderDelayMessage to useAlert)
- [x]  support inline CSS
- [x]  API requests to relative path: '../api/data....' (handled with jQuery AJAX override)
- [x]  Support custom tabs: a lot of custom tabs with jquery plugins: $( "#tabs" ).tabs();
- [x]  jquery UI: floatThead, tabs,
- [ ] decide what to bring over from the old Struts `/src/main/webapp/dhis-web-commons/javascripts/commons.js`
    - [ ] show/hide loader
- [ ] ensure events events:  dhis2.util.on(dhis2.de.event.formReady", dhis2.de.event.dataValuesLoaded, dhis2.de.event.dataValueSaved, dhis2.de.event.completed
- [ ] Other implicit contracts: IDs to data elements, `$('#morb')` `$('#mort')`??, window.location.pathname.indexOf("dataentry")
- [ ] _Possible_  future optimisations: 
- [ ] concatenate all JS for faster loading
- [ ] maybe make loading some JS files optional (through dataStore seting?)
    - [ ] Provide a guide (script?) to replace jQuery operations as they're mostly redundant in modern browsers now 
- [ ] ensure the external scripts are cached on production (or reused by the plugin) etc...
 
! ToDos for new custom forms
- interface for selecting items, similar to: document.querySelector("#hiTm0oSRRRi-HoIsxzhEmia-val");

*/

const { externalCSS, externalScripts } = getBaseExternalFiles()

const LegacyCustomFormPlugin = (props) => {
    /* 
    This is what get passed from data-entry app and effectively the contract for custom form plugins (legacy or not)
    */
    const {
        htmlCode,
        // initialValues,
        metadata,
        // dataSet,
        // saveValue,
        periodId,
        dataSetId,
        orgUnitId,
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
        ({ message }) => message,
        { warning: true }
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
                baseUrl: config?.systemInfo?.contextPath,
                scripts: formScripts,
                metadata,
                orgUnitId,
                hideAlert,
                showAlert,
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
