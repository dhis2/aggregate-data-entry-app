const defaultDisplayOptions = {
    beforeSectionText: '',
    pivotMode: 'n/a',
    afterSectionText: '',
    pivotCategory: null,
}
export const getDisplayOptions = (section) => {
    if (!section) {
        return defaultDisplayOptions
    }

    try {
        const { displayOptions: displayOptionString } = section

        const displayOptions = JSON.parse(displayOptionString)
        return displayOptions
    } catch (e) {
        // console.log(`Failed to parse displayOptions for section ${section?.id}`)
        console.error(
            `Failed to parse displayOptions for section ${section?.displayName}(${section?.id})`,
            e
        )
        return defaultDisplayOptions
    }
}
