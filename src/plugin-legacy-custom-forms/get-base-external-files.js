import externalCSS from './content/external-css.js'
import externalScripts from './content/external-scripts.js'

const getBaseExternalFiles = () => {
    const scriptsToAdd = externalScripts.map((scriptFile) => {
        const script = document.createElement('script')
        script.src = `legacy-custom-forms/${scriptFile}`
        // * making sure that the script are sync to avoid race conditions and to copy the loading behaviour of the struts templates
        script.async = false
        return script
    })

    
    const cssToAdd = externalCSS.map((cssFile) => {
        // ? what other CSS files we should include? the base CSS from old Struts - would people expect the look to be similar to the old version
        const style = document.createElement('link')
        style.href = `legacy-custom-forms/${cssFile}`
        style.type = 'text/css'
        style.rel = 'stylesheet'
        // head.append(style)
        return style
    })
    
    return {externalScripts: scriptsToAdd, externalCSS: cssToAdd}
    
}

export default getBaseExternalFiles
