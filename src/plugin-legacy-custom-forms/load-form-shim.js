/*
! The following part is the shim to make the transition of legacy forms as smooth as possible
! it consists of several workarounds for the "contracts" that custom forms depended on
! these contracts are either global JS objects, for example under de.dataSets and other objects exposed mostly in form.js 
! or other implicit contract like HTML elements that custom forms used to get some values (i.e. #selectedPeriodId)
*/

const loadCustomFormShim = ({
    periodId,
    dataSetId,
    attributeOptionComboSelection,
    baseUrl,
    metadata,
    orgUnitId,
    hideAlert,
    showAlert,
}) => {
    // * adding periodId and dataSetId to hidden selects so that previous jQuery code works as it is
    // ToDo: is getting period from selectedPeriodId a common enough pattern to have a workaround?
    const periodInput = document.createElement('input')
    periodInput.id = 'selectedPeriodId'
    periodInput.value = periodId
    periodInput.hidden = true

    const dataSetInput = document.createElement('input')
    dataSetInput.id = 'selectedDataSetId'
    dataSetInput.value = dataSetId
    dataSetInput.hidden = true

    if (attributeOptionComboSelection) {
        Object.keys(attributeOptionComboSelection).forEach((selection) => {
            const aocInput = document.createElement('input')
            aocInput.id = `category-${selection}`
            aocInput.value = attributeOptionComboSelection[selection]
            aocInput.hidden = true
            document.body.append(aocInput)
        })
    }

    document.body.append(periodInput, dataSetInput)

    // ! the organisation unit was typically retrieved from  selection.getSelected()[0]; based on OUWT.js
    // Todo: fake Selection API (https://developer.mozilla.org/en-US/docs/Web/API/Selection) as well? so that code like this works: dhis2.de.currentOrganisationUnitId = selection.getSelected()[0]
    window.dhis2.de.currentOrganisationUnitId = orgUnitId
    window.dhis2.de.currentDataSetId = dataSetId
    window.dhis2.de.currentPeriodId = periodId // ! doesn't exist in original object but seems reasonable to provide
    window.dhis2.de.defaultCategoryCombo = Object.values(
        metadata.categoryCombos
    )?.find?.((co) => co.isDefault)?.id
    window.dhis2.de.categories = metadata.categories
    window.dhis2.de.categoryCombos = metadata.categoryCombos
    window.dhis2.de.dataElements = metadata.dataElements
    window.dhis2.de.optionSets = metadata.optionSets

    // ?ToDo: these also used to be loaded from metadata in form.js - there is no direct equivalent now, what do we do with them?
    // dhis2.de.emptyOrganisationUnits = metaData.emptyOrganisationUnits;
    // dhis2.de.significantZeros = metaData.significantZeros;
    // dhis2.de.indicatorFormulas = metaData.indicatorFormulas; //? is this the same as indicators?
    // dhis2.de.lockExceptions = metaData.lockExceptions;

    const dataSetsForForm = {}
    for (const [key, value] of Object.entries(metadata.dataSets)) {
        dataSetsForForm[key] = {
            ...value,
            //? custom forms expect periodId - do we update the forms, or update the object (and where do we stop with these shims!)?
            periodId: value?.period,
        }
    }

    window.dhis2.de.dataSets = dataSetsForForm

    //* make sure that all AJAX requests go to the Backend Url
    //* there are a variety of workarounds that people do currently but this should make them obsolete (as well as help with local development)
    //! it's also a pseudo-security measure, as it basically ensures that all calls are to the DHIS2 server - no outside API calls
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
    window.dhis2.period.calendar = window.$.calendars.instance('gregorian')
    window.dhis2.period.generator = new window.dhis2.period.PeriodGenerator(
        window.dhis2.period.calendar,
        window.dhis2.period.format
    )
    window.dhis2.period.picker = new window.dhis2.period.DatePicker(
        window.dhis2.period.calendar,
        window.dhis2.period.format
    )

    window.dhis2.shim = window.dhis2.shim || {}
    window.dhis2.shim.showAlert = showAlert
    window.dhis2.shim.hideAlert = hideAlert
    window.setHeaderDelayMessage = (message) => {
        showAlert({ message })
    }

    window.dhis2.shim.metadata = metadata
}

export default loadCustomFormShim
