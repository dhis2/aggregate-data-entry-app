/**
 * ToDo
 * 1. decide which scripts are necessary and should be bundled
 * 2. (maybe) concatenate the files in a single file (or few files) to simplify order logic and improve performance
 * 3. optimise that these scripts are not re-loaded every time
 *
 * What to do with all the date utilities? How common are they - is it easier to migrate to newer patterns
 *
 */

// ! add form and entry.js from core
const files = [
    'javascripts/jQuery/jquery.min.js',
    'javascripts/jQuery/placeholders.jquery.min.js',
    'javascripts/jQuery/jquery.utils.js',
    'javascripts/jQuery/jquery.ext.js',
    'javascripts/jQuery/jquery.metadata.js',
    'javascripts/jQuery/jquery.tablesorter.min.js',
    'javascripts/jQuery/jquery.upload-1.0.2.min.js',
    'javascripts/jQuery/jquery.dhisAjaxSelect.js',
    'javascripts/jQuery/ui/jquery-ui.min.js',
    'javascripts/jQuery/ui/jquery.blockUI.js',
    'javascripts/jQuery/jquery.validate.js',
    'javascripts/jQuery/jquery.validate.ext.js',
    'javascripts/jQuery/jquery.cookie.js',

    'javascripts/jQuery/jquery.glob.js',
    'javascripts/jQuery/jquery.date.js',
    'javascripts/jQuery/jquery.tmpl.js',
    'javascripts/jQuery/jquery.autogrow.js',
    'javascripts/jQuery/jquery.fileupload.min.js',
    // 'javascripts/underscore.min.js',
    // 'javascripts/filesize.min.js',
    'javascripts/dhis2/dhis2.util.js',
    // 'javascripts/commons.js',
    // 'javascripts/commons.ajax.js',
    // 'javascripts/lists.js',
    // 'javascripts/periodType.js',
    // 'javascripts/date.js',
    // 'javascripts/json2.js',
    // 'javascripts/validationRules.js',
    'javascripts/dhis2/dhis2.array.js',
    'javascripts/dhis2/dhis2.select.js',
    'javascripts/jQuery/calendars/jquery.calendars.min.js',
    'javascripts/jQuery/calendars/jquery.calendars.plus.min.js',

    // 'javascripts/moment/moment-with-langs.min.js',
    // 'select2/select2.min.js',
    'javascripts/floatThead/jquery.floatThead.min.js',

    // ? all the calendar and date utilties take up the bulk of space - maybe they can be bundled optionally?
    // jquery calendars
    'javascripts/dhis2/dhis2.period.js',
    'javascripts/dhis2/dhis2.selected.js',
    'javascripts/dhis2/dhis2.comparator.js',
    'javascripts/dhis2/dhis2.availability.js',
    'javascripts/dhis2/dhis2.trigger.js',
    'javascripts/dhis2/dhis2.sharing.js',
    'javascripts/dhis2/dhis2.validation.js',
    'javascripts/dhis2/dhis2.storage.ss.js',
    'javascripts/dhis2/dhis2.storage.ls.js',
    'javascripts/dhis2/dhis2.storage.idb.js',
    'javascripts/dhis2/dhis2.storage.memory.js',
    'javascripts/dhis2/dhis2.storage.js',
    'javascripts/dhis2/dhis2.contextmenu.js',
    'javascripts/dhis2/dhis2.appcache.js',
    'javascripts/dhis2/dhis2.translate.js',

    // form-entry
    // 'javascripts/ouwt/ouwt.js',
    'javascripts/data-entry/form.js',
    'javascripts/data-entry/entry.js',
    // 'javascripts/data-entry/entry.fileresource.js',
    // 'javascripts/data-entry/history.js',
]

export default files
