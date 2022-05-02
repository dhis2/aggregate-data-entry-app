var i18n_month_short_january = 'Jan'
var i18n_month_short_february = 'Feb'
var i18n_month_short_march = 'Mar'
var i18n_month_short_april = 'Apr'
var i18n_month_short_may = 'May'
var i18n_month_short_june = 'Jun'
var i18n_month_short_july = 'Jul'
var i18n_month_short_august = 'Aug'
var i18n_month_short_september = 'Sep'
var i18n_month_short_october = 'Oct'
var i18n_month_short_november = 'Nov'
var i18n_month_short_december = 'Dec'
var monthNamesShort = [
    i18n_month_short_january,
    i18n_month_short_february,
    i18n_month_short_march,
    i18n_month_short_april,
    i18n_month_short_may,
    i18n_month_short_june,
    i18n_month_short_july,
    i18n_month_short_august,
    i18n_month_short_september,
    i18n_month_short_october,
    i18n_month_short_november,
    i18n_month_short_december,
]

var i18n_month_january = 'January'
var i18n_month_february = 'February'
var i18n_month_march = 'March'
var i18n_month_april = 'April'
var i18n_month_may = 'May'
var i18n_month_june = 'June'
var i18n_month_july = 'July'
var i18n_month_august = 'August'
var i18n_month_september = 'September'
var i18n_month_october = 'October'
var i18n_month_november = 'November'
var i18n_month_december = 'December'
var monthNames = [
    i18n_month_january,
    i18n_month_february,
    i18n_month_march,
    i18n_month_april,
    i18n_month_may,
    i18n_month_june,
    i18n_month_july,
    i18n_month_august,
    i18n_month_september,
    i18n_month_october,
    i18n_month_november,
    i18n_month_december,
]

var i18n_weekday_short_monday = 'Mon'
var i18n_weekday_short_tuesday = 'Tue'
var i18n_weekday_short_wednesday = 'Wed'
var i18n_weekday_short_thursday = 'Thu'
var i18n_weekday_short_friday = 'Fri'
var i18n_weekday_short_saturday = 'Sat'
var i18n_weekday_short_sunday = 'Sun'
var dayNamesShort = [
    i18n_weekday_short_sunday,
    i18n_weekday_short_monday,
    i18n_weekday_short_tuesday,
    i18n_weekday_short_wednesday,
    i18n_weekday_short_thursday,
    i18n_weekday_short_friday,
    i18n_weekday_short_saturday,
]
var dayNamesMin = [
    i18n_weekday_short_sunday,
    i18n_weekday_short_monday,
    i18n_weekday_short_tuesday,
    i18n_weekday_short_wednesday,
    i18n_weekday_short_thursday,
    i18n_weekday_short_friday,
    i18n_weekday_short_saturday,
]

var i18n_please_enter_name = 'Please enter name!'
var i18n_please_select_period = 'Please select period!'
var i18n_please_select_dataset = 'Please select data set!'
var i18n_please_select_dataelement = 'Please select data element!'
var i18n_please_select_indicator = 'Please select indicator!'
var i18n_please_enter_description = 'Please enter description!'
var i18n_delete_confirm = 'Do you want to delete?'
var i18n_deleting = 'Deleting'
var i18n_ok = 'OK'
var i18n_cancel = 'Cancel'
var i18n_edit = 'Edit'
var i18n_available = 'Available'
var i18n_edit = 'Edit'
var i18n_selected = 'Edit'
var i18n_show_menu = 'Show menu'
var i18n_warning = 'Warning'
var i18n_error = 'Error'
var i18n_success = 'Success'
var i18n_hide_menu = 'Hide menu'
var i18n_waiting = 'Please wait'
var i18n_enter_digits = 'Please enter only digits.'
var i18n_process = 'Processing...'
var i18n_delete_success = 'Object deleted'
var i18n_no_item_to_export = 'There is no item to export'

var i18n_username_in_password = 'Username cannot be part of password'
var i18n_email_in_password = 'Email cannot be part of password'
var i18n_username_email_in_password =
    'Username/Email cannot be part of password'

var validationMessage = {
    required: 'This field is required.',
    remote: 'Please fix this field.',
    email: 'Please enter a valid email address.',
    url: 'Please enter a valid URL.',
    date: 'Please enter a valid date.',
    dateISO: 'Please enter a valid date (e.g. 1990-01-01).',
    number: 'Please enter a valid number.',
    digits: 'Please enter only digits.',
    lettersdigitsonly: 'Please enter letters or digits.',
    equalTo: 'The entered values do not match. Please re-enter the values.',
    accept: 'Please enter a value with a valid extension.',
    firstletteralphabet: 'The first character must be a letter.',
    maxlength: validatorFormat('Please enter no more than {0} characters.'),
    minlength: validatorFormat('Please enter at least {0} characters.'),
    rangelength: validatorFormat(
        'Please enter a value between {0} and {1} characters long.'
    ),
    range: validatorFormat('Please enter a value between {0} and {1}.'),
    max: validatorFormat('Please enter a value less than or equal to {0}.'),
    min: validatorFormat('Please enter a value greater than or equal to {0}.'),
    notequalto: 'Please enter a different value than above.',
    decimals:
        'Please enter digits only. Three digits before decimal point and two after the decimal point are allowed.',
    alphanumeric: 'Only letters, numbers, spaces and underscores are allowed.',
    alphanumericwithbasicpuncspaces:
        'Only letters, numbers, spaces and the characters \n .,-,(,) are allowed.',
    letterswithbasicspecialchars:
        'Only letters, numbers, spaces and the characters \n .,-,(,) are allowed.',
    lessthanequal: validatorFormat(
        'Please enter a value less than or equal to {1}'
    ),
    greaterthanequal: validatorFormat(
        'Please enter a value greater than or equal to {1}'
    ),
    unique: 'Please do not enter same values.',
    letterswithbasicpunc: 'Letters or punctuation only please.',
    maxWords: validatorFormat('Please enter {0} words or less.'),
    minWords: validatorFormat('Please enter at least {0} words.'),
    rangeWords: validatorFormat('Please enter between {0} and {1} words.'),
    lettersonly: 'Letters only please.',
    nowhitespace: 'No white space please',
    nostartwhitespace: 'This field cannot start with a space.',
    ziprange: 'Your ZIP-code must be in the range 902xx-xxxx to 905-xx-xxxx',
    time: 'Please enter a valid time, between 00:00 and 23:59.',
    phone: 'Please specify a valid phone number.',
    strippedminlength: 'Please enter at least {0} characters.',
    datelessthanequaltoday: 'This date can not be after today.',
    required_group: 'Please fill out at least one of these fields.',
    required_select_group:
        'Please select at least one option for these fields.',
    password:
        'Password must contain at least one capital letter and one digit.',
    notOnlyDigits: 'Only digits are not allowed',
    custome_regex: validatorFormat('{1}'),
    greaterDate:
        'The ClosedDate field should be greater than the OpenDate field.',
    unicodechars: 'Valid Unicode characters only are allowed.',
    unrecognizedcoordinatestring: 'Unrecognized coordinate string',
    number: 'Please enter a valid number.',
    integer: 'Please enter a valid integer.',
    positive_integer: 'Please enter a valid positive integer.',
    negative_integer: 'Please enter a valid negative integer.',
}
