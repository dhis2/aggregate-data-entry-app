import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import externalCSS from './external-css.js'
import externalScripts from './external-scripts.js'
import customFormStyles from '../data-workspace/custom-form/custom-form.module.css'

const CustomFormPlugin = (props) => {
    /* 
    This is what get passed from data-entry app and effectively the contract for custom forms
    - htmlCode and saveValue are the minimum required. The rest is to ensure people have a way to do whatever they want
    */
    // ? Does saveValue gets proxied to the jQuery version available globally (once we add `form.js` here), or we provide a cleaner newer implementation?
    const {
        htmlCode,
        initialValues,
        metadata,
        dataSet,
        saveValue,
        periodId,
        dataSetId,
        orgUnitId,
    } = props

    console.log('[CustomFormPlugin] Plugin starting (plugin-wrapper.jsx)')

    console.log('[custom-forms] dataSets', dataSetId, metadata.dataSets[dataSetId])

    
    const config = useConfig()
    

    const doc = new DOMParser().parseFromString(htmlCode, 'text/html')
    const scriptsFromFrom = doc.getElementsByTagName('script')
    const originalFormScripts = []

    Array.from(scriptsFromFrom).forEach((script) => {
        // * removing the scripts from the form HTML, keeping them in a copy that gets appended at the end
        // ? what to do with inline JS - is that something commonly used
        const scriptCopy = document.createElement('script')
        scriptCopy.textContent = script.textContent
        scriptCopy.async = false
        originalFormScripts.push(scriptCopy)
        script.remove()
    })

    useEffect(() => {
        if (!htmlCode) {
            return
        }

        const scriptsToAdd = externalScripts.map((scriptFile) => {
            const script = document.createElement('script')
            script.src = scriptFile
            // * making sure that the script are sync to avoid race conditions
            script.async = false
            return script
        })

        const head = document.getElementsByTagName('head')[0]

        externalCSS.forEach(cssFile => {
            // Adding JQUERY UI CSS
            // ToDo: are there other CSS files that should be included? like the base CSS
            const style = document.createElement('link') 
            style.href = cssFile
            style.type = 'text/css'
            style.rel = 'stylesheet'
            head.append(style);
        })
        
        document.body.append(...scriptsToAdd)

        setTimeout(() => {
            // * adding periodId to a hidden select `selectedPeriodId` so that previous jQuery code works as it is
            // ToDo: is getting period from selectedPeriodId a common enough pattern to have a workaround?
            // ToDo: do we want to do the same (a fake hidden input) for selectedDataSetId
            const periodInput = document.createElement('input')
            periodInput.id = 'selectedPeriodId'
            periodInput.value = periodId // periodId from plugin wrapper
            periodInput.hidden = true

            const dataSetInput = document.createElement('input')
            dataSetInput.id = 'selectedDataSetId'
            dataSetInput.value = dataSetId 
            dataSetInput.hidden = true
            
            document.body.append(periodInput, dataSetInput)


            // Todo: fake Selection API as well
            // ! so that things like this work: dhis2.de.currentOrganisationUnitId = selection.getSelected()[0]

            // this was typically retrieved from  selection.getSelected()[0]; based on OUWT.js
            window.dhis2.de.currentOrganisationUnitId = orgUnitId
            window.dhis2.de.currentDataSetId = dataSetId
            window.dhis2.de.currentPeriodId = periodId // ! doesn't exist in original object but seems reasonable to provide


            const dataSetsForForm = {}
            for (const [key, value] of Object.entries(metadata.dataSets)) {
                dataSetsForForm[key] = {
                    ...value,
                    //! custom forms expect periodId - do we update the forms, or update the object (and where do we stop with these shims)?
                    periodId: value?.period
                }
            }
            console.log(dataSetsForForm)
            window.dhis2.de.dataSets = dataSetsForForm

            // window.dhis2.de.currentDataSetId = 

            //! make sure that all AJAX requests go to the BE Url
            //! there are a variety of workarounds that people do but this should make things easier
            var baseUrl = config.baseUrl //'http://localhost:8080/';
            window.DHIS_BASE_URL = baseUrl + '/'
            window.$.ajaxSetup({
                beforeSend: function(xhr, options) {
                    options.url = baseUrl + options.url;
                    options.xhrFields = { ...options.xhrFields, withCredentials: true }
                }
            })

            /**
             * ! these global objects were initialised as part of main.vm (dhis-web/dhis-web-commons-resources/src/main/webapp/main.vm)
             * for calendar 
             * 
             * ? Do we want to support multi-calendar in this custom form world (please say No!)
             */
            window.dhis2.period.format = '$dateFormat.js';
            window.dhis2.period.calendar = window.$.calendars.instance('gregorian');
            window.dhis2.period.generator = new window.dhis2.period.PeriodGenerator( window.dhis2.period.calendar, window.dhis2.period.format );
            window.dhis2.period.picker = new window.dhis2.period.DatePicker( window.dhis2.period.calendar, window.dhis2.period.format );

            // * appending the scripts that are part of the custom form at the end (after jQuery and dhis2 utils are loaded)
            // ToDo: find a better way to control the order of loading scripts
            document.body.append(...originalFormScripts)
            window.dhis2?.de?.loadForm();
        }, 1000) // ToDo: find a better way to delay loading the scripts from the HTML form

        // ToDo: move from this custom handler to the one provided by the global jQuery utilities
        // document.querySelectorAll('input').forEach((input) => {
        //     const [deId, cocId] = input?.id?.split('-') ?? []
        //     input.value = initialValues[deId]?.[cocId]?.value ?? ''

        //     // calling the save value when an input is blurred
        //     input.addEventListener('blur', (event) => {
        //         const { value } = event.target
        //         saveValue({ deId, cocId, value })
        //     })
        // })

        // ! Other todos
        // ? - requests to relative pat: '../api/data....'
        // ? - custom tabs: a lot of custom tabs with jquery plugins: $( "#tabs" ).tabs();
        // ? - events  dhis2.util.on(
        // ?        dhis2.de.event.formReady",
        // ?        dhis2.de.event.dataValuesLoaded
        // ?        dhis2.de.event.dataValueSaved
        // ?        dhis2.de.event.completed
        // ? - dhis2.de.currentOrganisationUnitId;
        // ? - HTML contracts: IDs to data elements, $('#morb') $('#mort')??, window.location.pathname.indexOf("dataentry")
        // ? - jquery UI: floatThead, tabs,
        // ? - jQuery.getJSON( '../dhis-web-commons-ajax-json/getCategoryOptionCombos.action', {

        /**
         *  ! asks
         *  - Forms including HTML
         *  - example of tabbed custom form
         */

        /**
         * !for new custom forms
         * - interface for selecting items, similar to: document.querySelector("#hiTm0oSRRRi-HoIsxzhEmia-val");
         *
         */

        // ToDo: what cleanup is needed if any
        // return () => {
        //     document.body.removeChild(script)
        // }
    }, [])

    return (
        <div>
            <div>
                <h3>Legacy Custom Form plugin: {dataSet?.displayName}</h3>
                <div
                    className='cde-NORMAL'
                    // className={customFormStyles.customForm}
                    dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}
                ></div>
            </div>
        </div>
    )
}

CustomFormPlugin.propTypes = {
    htmlCode: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
    saveValue: PropTypes.func.isRequired,
    dataSet: PropTypes.shape({ displayName: PropTypes.string }),
    initialValues: PropTypes.shape({}),
    metadata: PropTypes.object,
}
export default CustomFormPlugin
