import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import classes from './plugin-wrapper.module.css'

const CustomFormPlugin = (props) => {
    /* 
    This is what get passed from data-entry app and effectively the contract for custom forms
    - htmlCode and saveValue are the minimum required. The rest is to ensure people have a way to do whatever they want
    */
    const { htmlCode, initialValues, metadata, dataSet, saveValue } = props

    console.log('CustomFormPlugin')
    useEffect(() => {
        if (!htmlCode) {
            return
        }

        // ToDo: what objects did struts used to put in the global scope - we should add them here
        // ToDo: maybe not namespace the values and leave them in th global object for backwards compatibility (they're only available in the iframe of the plugin)
        window.LEGACY_CUSTOM_FORM = {
            metadata,
            dataSet,
        }

        // ToDo: we are displaying inputs as they are .. no attempts to style them like ours. Do want to do that for users who go this route?
        // ToDo: do all custom forms want this default behaviour of saving on blur?, or maybe they provide their own save functionality
        document.querySelectorAll('input').forEach((input) => {
            const [deId, cocId] = input?.id?.split('-') ?? []
            input.value = initialValues[deId]?.[cocId]?.value ?? ''

            // calling the save value when an input is blurred
            input.addEventListener('blur', (event) => {
                const { value } = event.target
                saveValue({ deId, cocId, value })
            })
        })

        // Dangerous: the way to run existing javascript in the custom forms - complete flexibility for them (ala old-school custom forms) but a can of worms when it comes to security
        // ToDo: is there a safer way to do eval? (don't think so)
        // ToDo: this will not run code that is a callback to onDomReady or onLoad, because it's too late when it gets evaluated
        const dummyDoc = window.document.createElement('html')
        dummyDoc.innerHTML = htmlCode
        const scripts = Array.from(dummyDoc.getElementsByTagName('script'))
        scripts.forEach((script) => window.eval(script.innerText))
    }, [])

    // ToDo(custom-forms): resize height properly
    return (
        <div>
            <div>
                <h2>Custom Form Plugin: {dataSet?.displayName}</h2>
                <div>
                    <div
                        className={classes.container}
                        dangerouslySetInnerHTML={{ __html: htmlCode }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

CustomFormPlugin.propTypes = {
    htmlCode: PropTypes.string.isRequired,
    saveValue: PropTypes.func.isRequired,
    dataSet: PropTypes.shape({ displayName: PropTypes.string }),
    initialValues: PropTypes.shape({}),
    metadata: PropTypes.object,
}
export default CustomFormPlugin
