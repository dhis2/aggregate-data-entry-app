import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import externalCSS from './external-css.js'
import externalScripts from './external-scripts.js'

const CustomFormPlugin = (props) => {
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

    console.log(
        '[custom-forms] dataSets',
        dataSetId,
        metadata.dataSets[dataSetId]
    )

    const config = useConfig()

    // Load the htmlCode into a doc to allow manipulating it
    const doc = new DOMParser().parseFromString(htmlCode, 'text/html')
    const scriptsFromFrom = doc.getElementsByTagName('script')

    const originalFormScripts = useMemo(() => {
        const scriptsList = []
        Array.from(scriptsFromFrom).forEach((script) => {
            // * removing the scripts from the form HTML, keeping them in a copy that gets appended at the end
            // ? would this work with inline JS? is that a common pattern? is that not blocked by CSP?
            const scriptCopy = document.createElement('script')
            scriptCopy.textContent = script.textContent
            scriptCopy.async = false
            scriptsList.push(scriptCopy)
            script.remove()
        })
        return scriptsList
    }, [scriptsFromFrom])

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

        setTimeout(() => {
            // * adding periodId and dataSetId to hidden selects so that previous jQuery code works as it is
            // ToDo: is getting period from selectedPeriodId a common enough pattern to have a workaround?
            const periodInput = document.createElement('input')
            periodInput.id = 'selectedPeriodId'
            periodInput.value = periodId // periodId from plugin wrapper
            periodInput.hidden = true

            const dataSetInput = document.createElement('input')
            dataSetInput.id = 'selectedDataSetId'
            dataSetInput.value = dataSetId
            dataSetInput.hidden = true

            document.body.append(periodInput, dataSetInput)

            // Todo: fake Selection API as well? so that things like this work: dhis2.de.currentOrganisationUnitId = selection.getSelected()[0]

            // the organisation unit was typically retrieved from  selection.getSelected()[0]; based on OUWT.js
            window.dhis2.de.currentOrganisationUnitId = orgUnitId
            window.dhis2.de.currentDataSetId = dataSetId
            window.dhis2.de.currentPeriodId = periodId // ! doesn't exist in original object but seems reasonable to provide

            const dataSetsForForm = {}
            for (const [key, value] of Object.entries(metadata.dataSets)) {
                dataSetsForForm[key] = {
                    ...value,
                    //? custom forms expect periodId - do we update the forms, or update the object (and where do we stop with these shims)?
                    periodId: value?.period,
                }
            }

            window.dhis2.de.dataSets = dataSetsForForm

            //* make sure that all AJAX requests go to the Backend Url
            //* there are a variety of workarounds that people do currently but this should make them obsolete (as well as help with local development)
            //! it's also a pseudo-security measure, as it basically ensures that all calls are to the DHIS2 server - no outside API calls
            var baseUrl = config.baseUrl
            window.DHIS_BASE_URL = baseUrl + '/'
            window.$.ajaxSetup({
                beforeSend: function (xhr, options) {
                    if (!options.url?.match(baseUrl)) {
                        options.url = baseUrl + options.url
                    }
                    options.xhrFields = {
                        ...options.xhrFields,
                        withCredentials: true,
                    }
                },
            })

            /**
             * ! these global objects were initialised as part of main.vm (dhis-web/dhis-web-commons-resources/src/main/webapp/main.vm) for calendar
             *
             * ? Do we want to support multi-calendar in this custom form world (please say No!)
             */
            window.dhis2.period.format = '$dateFormat.js'
            window.dhis2.period.calendar =
                window.$.calendars.instance('gregorian')
            window.dhis2.period.generator =
                new window.dhis2.period.PeriodGenerator(
                    window.dhis2.period.calendar,
                    window.dhis2.period.format
                )
            window.dhis2.period.picker = new window.dhis2.period.DatePicker(
                window.dhis2.period.calendar,
                window.dhis2.period.format
            )

            // * appending the scripts that are part of the custom form at the end (after jQuery and dhis2 utils are loaded)
            // ToDo: find a better way to control the order of loading scripts
            document.body.append(...originalFormScripts)
            window.dhis2?.de?.loadForm()
        }, 1000) // ToDo: find a better way to delay loading the scripts from the HTML form

        // ! - Other todos/notes:
        // !    - expose a loading function
        // !    - update form.js
        // !         - calls to legacy API `x.action`
        //// - requests to relative pat: '../api/data....' (handled with jQuery AJAX override)
        //// - custom tabs: a lot of custom tabs with jquery plugins: $( "#tabs" ).tabs();
        //// - dhis2.de.currentOrganisationUnitId;
        //// - jquery UI: floatThead, tabs,
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
        htmlCode,
        metadata.dataSets,
        orgUnitId,
        originalFormScripts,
        periodId,
    ])

    return (
        <div>
            <div>
                <h3>Legacy Custom Form plugin: {dataSet?.displayName}</h3>
                <div
                    className="cde-NORMAL"
                    // className={customFormStyles.customForm}
                    dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}
                ></div>
            </div>
        </div>
    )
}

CustomFormPlugin.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    htmlCode: PropTypes.string.isRequired,
    orgUnitId: PropTypes.string.isRequired,
    periodId: PropTypes.string.isRequired,
    dataSet: PropTypes.shape({ displayName: PropTypes.string }),
    initialValues: PropTypes.shape({}),
    metadata: PropTypes.object,
}
export default CustomFormPlugin
