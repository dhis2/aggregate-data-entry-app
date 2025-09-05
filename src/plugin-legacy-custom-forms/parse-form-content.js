const parseFormContent = (doc) => {
    const scriptsFromFrom = doc.getElementsByTagName('script')
    const stylesFromForm = doc.getElementsByTagName('style')

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

    return {scripts: scriptsList ?? [], styles: stylesFromForm ?? []}
}

export default parseFormContent