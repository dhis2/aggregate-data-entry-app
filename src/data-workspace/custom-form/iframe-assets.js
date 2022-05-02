export const CSS_FILES = [
    {
        media: 'screen',
        styleSheet: '../custom-forms/css/jquery-ui.css',
    },
    {
        media: 'screen',
        styleSheet: '../custom-forms/css/dhis-web-dataentry.css',
    },
    {
        media: 'print',
        styleSheet: '../custom-forms/css/print.css',
    },
    {
        media: 'screen,print',
        styleSheet: '../custom-forms/css/light_blue.css',
    },
]

// TODO: We should probably use a "curated" list of JS assets like below
// but for now we just use all struts assets to get the basics working

// export const SCRIPT_FILES = [
//     '/dhis-web-commons/javascripts/jQuery/jquery.min.js',
//     '/dhis-web-commons/javascripts/jQuery/jquery.utils.js',
//     '/dhis-web-commons/javascripts/jQuery/ui/jquery-ui.min.js',
//     '/dhis-web-commons/javascripts/dhis2/dhis2.util.js',
//     '/dhis-web-commons/javascripts/dhis2/dhis2.period.js',
//     '/dhis-web-commons/javascripts/commons.js',
//     '/dhis-web-commons/javascripts/commons.ajax.js',
//     '/dhis-web-commons/javascripts/lists.js',
//     '/dhis-web-commons/javascripts/dhis2/dhis2.period.js',
//     '/dhis-web-commons/javascripts/periodType.js',
//     '/dhis-web-commons/javascripts/date.js',
//     '/dhis-web-commons/oust/oust.js',
//     '/dhis-web-commons/javascripts/dhis2/dhis2.storage.ss.js',
//     '/dhis-web-commons/javascripts/dhis2/dhis2.storage.ls.js',
//     '/dhis-web-commons/javascripts/dhis2/dhis2.storage.idb.js',
//     '/dhis-web-commons/javascripts/dhis2/dhis2.storage.memory.js',
//     '/dhis-web-commons/javascripts/dhis2/dhis2.storage.js',
//     // Note, these are not in dhis2-web-commons.
//     // Probably not a future proof way of doing stuff
//     'javascript/form.js',
//     'javascript/entry.js',
//     'javascript/history.js',
//     'javascript/entry.fileresource.js',
// ]

// All script files hosted locally so they can be edited for testing stuff
export const SCRIPT_FILES = [
    '../custom-forms/js/jquery.min.js',
    '../custom-forms/js/jquery.utils.js',
    '../custom-forms/js/jquery.ext.js',
    '../custom-forms/js/jquery.metadata.js',
    '../custom-forms/js/jquery.tablesorter.min.js',
    '../custom-forms/js/jquery.upload-1.0.2.min.js',
    '../custom-forms/js/jquery.dhisAjaxSelect.js',
    '../custom-forms/js/jquery-ui.min.js',
    '../custom-forms/js/jquery.blockUI.js',
    '../custom-forms/js/jquery.validate.js',
    '../custom-forms/js/jquery.validate.ext.js',
    '../custom-forms/js/jquery.cookie.js',
    '../custom-forms/js/jquery.glob.js',
    '../custom-forms/js/jquery.date.js',
    '../custom-forms/js/jquery.tmpl.js',
    '../custom-forms/js/jquery.autogrow.js',
    '../custom-forms/js/jquery.fileupload.min.js',
    '../custom-forms/js/underscore.min.js',
    '../custom-forms/js/filesize.min.js',
    '../custom-forms/js/dhis2.util.js',
    '../custom-forms/js/commons.js',
    '../custom-forms/js/commons.ajax.js',
    '../custom-forms/js/lists.js',
    '../custom-forms/js/periodType.js',
    '../custom-forms/js/date.js',
    '../custom-forms/js/json2.js',
    '../custom-forms/js/validationRules.js',
    '../custom-forms/js/dhis2.array.js',
    '../custom-forms/js/dhis2.select.js',
    '../custom-forms/js/jquery.calendars.min.js',
    '../custom-forms/js/jquery.calendars.plus.min.js',
    '../custom-forms/js/moment-with-langs.min.js',
    '../custom-forms/js/select2.min.js',
    '../custom-forms/js/dhis2.period.js',
    '../custom-forms/js/jquery.calendars.picker.min.js',
    '../custom-forms/js/dhis2.selected.js',
    '../custom-forms/js/dhis2.comparator.js',
    '../custom-forms/js/dhis2.availability.js',
    '../custom-forms/js/dhis2.trigger.js',
    '../custom-forms/js/dhis2.sharing.js',
    '../custom-forms/js/dhis2.validation.js',
    '../custom-forms/js/dhis2.storage.ss.js',
    '../custom-forms/js/dhis2.storage.ls.js',
    '../custom-forms/js/dhis2.storage.idb.js',
    '../custom-forms/js/dhis2.storage.memory.js',
    '../custom-forms/js/dhis2.storage.js',
    '../custom-forms/js/dhis2.contextmenu.js',
    '../custom-forms/js/dhis2.appcache.js',
    '../custom-forms/js/dhis2.translate.js',
    // this was a `.action` extension, but I changed it manually
    '../custom-forms/js/i18nJavaScript.js',
    '../custom-forms/js/main.js',
    '../custom-forms/js/request.js',
    '../custom-forms/js/ouwt.js',
    '../custom-forms/js/form.js',
    '../custom-forms/js/entry.js',
    '../custom-forms/js/history.js',
    '../custom-forms/js/entry.fileresource.js',
    '../custom-forms/js/jquery.floatThead.min.js',
]

export const PAGE_SCRIPTS = `
<script type="text/javascript">
    var dateFormat = 'yy-mm-dd';
</script>
<script>
    $.ajaxSetup( {
        beforeSend: function(xhr) {
            xhr.setRequestHeader(
                'X-Requested-With',
                {
                    toString: function() {
                        return '';
                    }
                }
            );
        }
    });
</script>
<script>
    dhis2.period.format = 'yyyy-mm-dd';
    dhis2.period.calendar = $.calendars.instance('gregorian');
    dhis2.period.generator = new dhis2.period.PeriodGenerator( dhis2.period.calendar, dhis2.period.format );
    dhis2.period.picker = new dhis2.period.DatePicker( dhis2.period.calendar, dhis2.period.format );
</script>
`

export const PAGE_STYLES = `
    html {
        line-height: 1.15;
        font-size: 14px;
        text-size-adjust: 100%;
    }
    body {
        font-family: Roboto, sans-serif;
        box-sizing: inherit;
    }
    table {
        margin-top: 16px;
        border-collapse: collapse;
    }
    table td,
    table th {
        border: 1px solid #bcbcbc;
        padding: 4px;
    }
`
