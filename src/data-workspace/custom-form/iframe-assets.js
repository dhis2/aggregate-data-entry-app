export const CSS_FILES = [
    {
        media: 'screen',
        styleSheet:
            '/dhis-web-commons/javascripts/jQuery/ui/css/redmond/jquery-ui.css',
    },
    {
        media: 'screen',
        styleSheet: 'style/dhis-web-dataentry.css',
    },
    {
        media: 'print',
        styleSheet: '/dhis-web-commons/css/print.css',
    },
    {
        media: 'screen,print',
        styleSheet: '/dhis-web-commons/css/themes/light_blue/light_blue.css',
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

export const SCRIPT_FILES = [
    '/dhis-web-commons/javascripts/jQuery/jquery.min.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.utils.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.ext.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.metadata.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.tablesorter.min.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.upload-1.0.2.min.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.dhisAjaxSelect.js',
    '/dhis-web-commons/javascripts/jQuery/ui/jquery-ui.min.js',
    '/dhis-web-commons/javascripts/jQuery/ui/jquery.blockUI.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.validate.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.validate.ext.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.cookie.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.glob.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.date.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.tmpl.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.autogrow.js',
    '/dhis-web-commons/javascripts/jQuery/jquery.fileupload.min.js',
    '/dhis-web-commons/javascripts/underscore.min.js',
    '/dhis-web-commons/javascripts/filesize.min.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.util.js',
    '/dhis-web-commons/javascripts/commons.js',
    '/dhis-web-commons/javascripts/commons.ajax.js',
    '/dhis-web-commons/javascripts/lists.js',
    '/dhis-web-commons/javascripts/periodType.js',
    '/dhis-web-commons/javascripts/date.js',
    '/dhis-web-commons/javascripts/json2.js',
    '/dhis-web-commons/javascripts/validationRules.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.array.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.select.js',
    '/dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.min.js',
    '/dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.plus.min.js',
    '/dhis-web-commons/javascripts/moment/moment-with-langs.min.js',
    '/dhis-web-commons/select2/select2.min.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.period.js',
    '/dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.picker.min.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.selected.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.comparator.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.availability.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.trigger.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.sharing.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.validation.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.storage.ss.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.storage.ls.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.storage.idb.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.storage.memory.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.storage.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.contextmenu.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.appcache.js',
    '/dhis-web-commons/javascripts/dhis2/dhis2.translate.js',
    '/dhis-web-commons/i18nJavaScript.action',
    '/main.js',
    '/request.js',
    '/dhis-web-commons/ouwt/ouwt.js',
    '"javascript/form.js',
    '"javascript/entry.js',
    '"javascript/history.js',
    '"javascript/entry.fileresource.js',
    '/dhis-web-commons/javascripts/floatThead/jquery.floatThead.min.js',
    '/api/files/script',
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
