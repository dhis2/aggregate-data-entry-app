import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import externalScripts from './external-scripts.js'
import classes from './plugin-wrapper.module.css'

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

    console.log('[CustomFormPlugin] Plugin starting', props)

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

        document.body.append(...scriptsToAdd)

        setTimeout(() => {
            // * adding periodId to a hidden select `selectedPeriodId` so that previous jQuery code works as it is
            // ToDo: is getting period from selectedPeriodId a common enough pattern to have a workaround?
            const input = document.createElement('input')
            input.id = 'selectedPeriodId'
            input.value = periodId // periodId from plugin wrapper
            input.hidden = true
            document.body.append(input)

            // * appending the scripts that are part of the custom form at the end (after jQuery and dhis2 utils are loaded)
            // ToDo: find a better way to control the order of loading scripts
            document.body.append(...originalFormScripts)
        }, 1000) // ToDo: find a better way to delay loading the scripts from the HTML form

        // ToDo: move from this custom handler to the one provided by the global jQuery utilities
        document.querySelectorAll('input').forEach((input) => {
            const [deId, cocId] = input?.id?.split('-') ?? []
            input.value = initialValues[deId]?.[cocId]?.value ?? ''

            // calling the save value when an input is blurred
            input.addEventListener('blur', (event) => {
                const { value } = event.target
                saveValue({ deId, cocId, value })
            })
        })

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
                <h2>Custom Form Plugin: {dataSet?.displayName}</h2>
                <div>
                    <div
                        className={classes.container}
                        dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}
                    ></div>
                </div>
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
