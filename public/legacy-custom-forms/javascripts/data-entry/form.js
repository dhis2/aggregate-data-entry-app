
dhis2.util.namespace( 'dhis2.de' );
dhis2.util.namespace( 'dhis2.de.api' );
dhis2.util.namespace( 'dhis2.de.event' );
dhis2.util.namespace( 'dhis2.de.cst' );

// API / methods to be used externally from forms / scripts

/**
 * Returns an object representing the currently selected state of the UI.
 * Contains properties for "ds", "pe", "ou" and the identifier of each
 * category with matching identifier values of the selected option.
 */
dhis2.de.api.getSelections = function() {
	var sel = dhis2.de.getCurrentCategorySelections();
	sel["ds"] = $( '#selectedDataSetId' ).val(),
	sel["pe"] = $( '#selectedPeriodId').val(),
	sel["ou"] = dhis2.de.currentOrganisationUnitId;	
	return sel;
}

// whether the browser is offline or not.
dhis2.de.isOffline = false;

// whether current user has any organisation units
dhis2.de.emptyOrganisationUnits = false;

// Identifiers for which zero values are insignificant, also used in entry.js
dhis2.de.significantZeros = [];

// Array with associative arrays for each data element, populated in select.vm
dhis2.de.dataElements = [];

// Associative array with [indicator id, expression] for indicators in form,
// also used in entry.js
dhis2.de.indicatorFormulas = [];

// Array with associative arrays for each data set, populated in select.vm
dhis2.de.dataSets = [];

// Maps input field to optionSet
dhis2.de.optionSets = {};

// Associative array with identifier and array of assigned data sets
dhis2.de.dataSetAssociationSets = [];

// Associate array with mapping between organisation unit identifier and data
// set association set identifier
dhis2.de.organisationUnitAssociationSetMap = [];

// Default category combo uid
dhis2.de.defaultCategoryCombo = undefined;

// Category combinations for data value attributes
dhis2.de.categoryCombos = {};

// Categories for data value attributes
dhis2.de.categories = {};

// LockExceptions
dhis2.de.lockExceptions = [];

// Array with keys {dataelementid}-{optioncomboid}-min/max with min/max values
dhis2.de.currentMinMaxValueMap = [];

// Indicates whether any data entry form has been loaded
dhis2.de.dataEntryFormIsLoaded = false;

// Indicates whether meta data is loaded
dhis2.de.metaDataIsLoaded = false;

// Currently selected organisation unit identifier
dhis2.de.currentOrganisationUnitId = null;

// Currently selected data set identifier
dhis2.de.currentDataSetId = null;

// Array with category objects, null if default category combo / no categories
dhis2.de.currentCategories = null;

// Current offset, next or previous corresponding to increasing or decreasing value
dhis2.de.currentPeriodOffset = 0;

// Current existing data value, prior to entry or modification
dhis2.de.currentExistingValue = null;

// Associative array with currently-displayed period choices, keyed by iso
dhis2.de.periodChoices = [];

// Periods locked because of data input periods start and end dates
dhis2.de.blackListedPeriods = [];

// Username of user who marked the current data set as complete if any
dhis2.de.currentCompletedByUser = null;

// Instance of the StorageManager
dhis2.de.storageManager = new StorageManager();

// Indicates whether current form is multi org unit
dhis2.de.multiOrganisationUnit = false;

// Indicates whether multi org unit is enabled on instance
dhis2.de.multiOrganisationUnitEnabled = false;

// Simple object to see if we have tried to fetch children DS for a parent before
dhis2.de.fetchedDataSets = {};

// "organisationUnits" object inherited from ouwt.js

// Constants

dhis2.de.cst.defaultType = 'INTEGER';
dhis2.de.cst.defaultName = '[unknown]';
dhis2.de.cst.dropDownMaxItems = 30;
dhis2.de.cst.formulaPattern = /#\{.+?\}/g;
dhis2.de.cst.separator = '.';
dhis2.de.cst.valueMaxLength = 50000;
dhis2.de.cst.metaData = 'dhis2.de.cst.metaData';
dhis2.de.cst.dataSetAssociations = 'dhis2.de.cst.dataSetAssociations';
dhis2.de.cst.downloadBatchSize = 5;

// Colors

dhis2.de.cst.colorGreen = '#b9ffb9';
dhis2.de.cst.colorYellow = '#fffe8c';
dhis2.de.cst.colorRed = '#ff8a8a';
dhis2.de.cst.colorOrange = '#ff6600';
dhis2.de.cst.colorWhite = '#fff';
dhis2.de.cst.colorGrey = '#ccc';
dhis2.de.cst.colorBorderActive = '#73ad72';
dhis2.de.cst.colorBorder = '#aaa';
dhis2.de.cst.colorLightGrey = '#dcdcdc';

// Form types

dhis2.de.cst.formTypeCustom = 'CUSTOM';
dhis2.de.cst.formTypeSection = 'SECTION';
dhis2.de.cst.formTypeMultiOrgSection = 'SECTION_MULTIORG';
dhis2.de.cst.formTypeDefault = 'DEFAULT';

// Events

dhis2.de.event.formLoaded = "dhis2.de.event.formLoaded";
dhis2.de.event.dataValuesLoaded = "dhis2.de.event.dataValuesLoaded";
dhis2.de.event.formReady = "dhis2.de.event.formReady";
dhis2.de.event.dataValueSaved = "dhis2.de.event.dataValueSaved";

/**
 * Convenience method to be used from inside custom forms. When a function is
 * registered inside a form it will be loaded every time the form is loaded,
 * hence the need to unregister and the register the function.
 */
dhis2.de.on = function( event, fn )
{
    $( document ).off( event ).on( event, fn );
};

var DAO = DAO || {};

dhis2.de.getCurrentOrganisationUnit = function() 
{    
    return dhis2.de.currentOrganisationUnitId;
};

DAO.store = new dhis2.storage.Store( {
    name: 'dhis2de',
    adapters: [ dhis2.storage.IndexedDBAdapter, dhis2.storage.DomSessionStorageAdapter, dhis2.storage.InMemoryAdapter ],
    objectStores: [ 'optionSets', 'forms' ]
} );

( function( $ ) {
    $.safeEach = function( arr, fn ) 
    {
        if ( arr )
        {
            $.each( arr, fn );
        }
    };
} )( jQuery );


// !(plugin) Check these connectivity events trigger (and what do we do with them)
$(document).bind('dhis2.online', function( event, loggedIn ) {
    dhis2.de.isOffline = false;

    if( loggedIn ) {
        dhis2.de.manageOfflineData();
    }
    else {
        var form = [
            '<form style="display:inline;">',
            '<label for="username">Username</label>',
            '<input name="username" id="username" type="text" style="width: 70px; margin-left: 10px; margin-right: 10px" size="10"/>',
            '<label for="password">Password</label>',
            '<input name="password" id="password" type="password" style="width: 70px; margin-left: 10px; margin-right: 10px" size="10"/>',
            '<button id="login_button" type="button">Login</button>',
            '</form>'
        ].join('');

        setHeaderMessage(form);
        dhis2.de.ajaxLogin();
    }
});

$(document).bind('dhis2.offline', function() {
    dhis2.de.isOffline = true;

    if( dhis2.de.emptyOrganisationUnits ) {
        setHeaderMessage(i18n_no_orgunits);
    }
    else {
        setHeaderMessage(i18n_offline_notification);
    }
});


// !(plugin): check as part of connectivity rework
dhis2.de.manageOfflineData = function()
{
    if( dhis2.de.storageManager.hasLocalData() ) {
        var message = i18n_need_to_sync_notification
          + ' <button id="sync_button" type="button">' + i18n_sync_now + '</button>';

        setHeaderMessage(message);

        $('#sync_button').bind('click', dhis2.de.uploadLocalData);
    }
    else {
        if( dhis2.de.emptyOrganisationUnits ) {
            setHeaderMessage(i18n_no_orgunits);
        }
        else {
            setHeaderDelayMessage(i18n_online_notification);
        }
    }
};

/**
 * (plugin) keeping this method in the plugin for backwards compatibility, 
 * but fetching data sets should not be necessary in this plugin paradigm as they are provided by the parent
 * 
 * @deprecated
 */
dhis2.de.shouldFetchDataSets = function( ids ) {
    warnDeprecate('dhis2.de.shouldFetchDataSets')
    return false;
};

/**
 * (plugin) we do not need to make an API to get metadata in the plugin as the metadata is provided by parent
 * which also sets the values on dhis2.de for convenience and backwards compatibility
 * 
 * @deprecated dhis2.de.loadMetaData does not make an API call anymore. Values are provided by the parent to the plugin.
 */
dhis2.de.loadMetaData = function()
{
    warnDeprecate('dhis2.de.loadMetadata')
};

function warnDeprecate(method, extraContext) {
    let message = `"${method}" is deprecated in the custom form plugin.`
    if(extraContext) {
        message += extraContext
    }
    console.warn(message)
}
/**
 * @deprecated
 */
dhis2.de.loadDataSetAssociations = function()
{
    warnDeprecate('dhis2.de.loadDataSetAssociations')
};

// ? (plugin) do we need to call this still (for manageOfflineData and updateForms)
dhis2.de.setMetaDataLoaded = function()
{
    dhis2.de.metaDataIsLoaded = true;
    $( '#loaderSpan' ).hide();
    console.log( 'Meta-data loaded' );

    dhis2.de.manageOfflineData();
    updateForms();
};

dhis2.de.discardLocalData = function() {
    if( confirm( i18n_remove_local_data ) ) {
        dhis2.de.storageManager.clearAllDataValues();
        hideHeaderMessage();
    }
};

dhis2.de.uploadLocalData = function()
{
    if ( !dhis2.de.storageManager.hasLocalData() )
    {
        return;
    }

    var dataValues = dhis2.de.storageManager.getAllDataValues();
    var completeDataSets = dhis2.de.storageManager.getCompleteDataSets();

    setHeaderWaitMessage( i18n_uploading_data_notification );

    var dataValuesArray = dataValues ? Object.keys( dataValues ) : [];
    var completeDataSetsArray = completeDataSets ? Object.keys( completeDataSets ) : [];

    function pushCompleteDataSets( array )
    {
        if ( array.length < 1 )
        {
            return;
        }

        var key = array[0];
        var value = completeDataSets[key];

        console.log( 'Uploaded complete data set: ' + key + ', with value: ' + value );

        $.ajax( {
            url: '../api/26/completeDataSetRegistrations',
            data: value,
            dataType: 'json',
            success: function( data, textStatus, jqXHR )
            {
            	dhis2.de.storageManager.clearCompleteDataSet( value );
                console.log( 'Successfully saved complete dataset with value: ' + value );
                ( array = array.slice( 1 ) ).length && pushCompleteDataSets( array );

                if ( array.length < 1 )
                {
                    setHeaderDelayMessage( i18n_sync_success );
                }
            },
            error: function( jqXHR, textStatus, errorThrown )
            {
            	if ( 409 === xhr.status || 500 === xhr.status ) // Invalid value or locked
            	{
            		// Ignore value for now TODO needs better handling for locking
            		
            		dhis2.de.storageManager.clearCompleteDataSet( value );
            	}
            	else // Connection lost during upload
        		{
                    var message = i18n_sync_failed
                        + ' <button id="sync_button" type="button">' + i18n_sync_now + '</button>'
                        + ' <button id="discard_button" type="button">' + i18n_discard + '</button>';

                    setHeaderMessage( message );

                    $( '#sync_button' ).bind( 'click', dhis2.de.uploadLocalData );
                    $( '#discard_button' ).bind( 'click', dhis2.de.discardLocalData );
        		}
            }
        } );
    }

    ( function pushDataValues( array )
    {
        if ( array.length < 1 )
        {
            setHeaderDelayMessage( i18n_online_notification );

            pushCompleteDataSets( completeDataSetsArray );

            return;
        }

        var key = array[0];
        var value = dataValues[key];

        if ( value !== undefined && value.value !== undefined && value.value.length > 254 )
        {
            value.value = value.value.slice(0, 254);
        }

        console.log( 'Uploading data value: ' + key + ', with value: ' + value );

        $.ajax( {
            url: '../api/dataValues',
            data: value,
            dataType: 'text',
            type: 'post',
            success: function( data, textStatus, xhr )
            {
            	dhis2.de.storageManager.clearDataValueJSON( value );
                console.log( 'Successfully saved data value with value: ' + value );
                ( array = array.slice( 1 ) ).length && pushDataValues( array );

                if ( array.length < 1 && completeDataSetsArray.length > 0 )
                {
                    pushCompleteDataSets( completeDataSetsArray );
                }
                else
                {
                    setHeaderDelayMessage( i18n_sync_success );
                }
            },
            error: function( xhr, textStatus, errorThrown )
            {
            	if ( 403 == xhr.status || 409 === xhr.status || 500 === xhr.status ) // Invalid value or locked
            	{
            		// Ignore value for now TODO needs better handling for locking
            		
            		dhis2.de.storageManager.clearDataValueJSON( value );
            	}
            	else // Connection lost during upload
            	{
	                var message = i18n_sync_failed
                    + ' <button id="sync_button" type="button">' + i18n_sync_now + '</button>'
                    + ' <button id="discard_button" type="button">' + i18n_discard + '</button>';

	                setHeaderMessage( message );

	                $( '#sync_button' ).bind( 'click', dhis2.de.uploadLocalData );
                  $( '#discard_button' ).bind( 'click', dhis2.de.discardLocalData );
            	}
            }
        } );
    } )( dataValuesArray );
};

// ToDO(plugin): go through these event listeners
dhis2.de.addEventListeners = function()
{
    $( '.entryfield, .entrytime, [name="entryfield"]' ).each( function( i )
    {
        var id = $( this ).attr( 'id' );
        var isTimeField = $( this ).hasClass('entrytime');

        // If entry field is a date picker, remove old target field, and change id
        if( /-dp$/.test( id ) )
        {
            var dpTargetId = id.substring( 0, id.length - 3 );
            $( '#' + dpTargetId ).remove();
            $( this ).attr( 'id', dpTargetId ).calendarsPicker( 'destroy' );
            id = dpTargetId;
        }

        var split = dhis2.de.splitFieldId( id );
        var dataElementId = split.dataElementId;
        var optionComboId = split.optionComboId;
        dhis2.de.currentOrganisationUnitId = split.organisationUnitId;

        var type = getDataElementType( dataElementId );

        $( this ).unbind( 'focus' );
        $( this ).unbind( 'blur' );
        $( this ).unbind( 'change' );
        $( this ).unbind( 'dblclick' );
        $( this ).unbind( 'keyup' );

        $( this ).focus( valueFocus );

        $( this ).blur( valueBlur );

        $( this ).change( function()
        {
            saveVal( dataElementId, optionComboId, id );
        } );

        $( this ).dblclick( function()
        {
            viewHist( dataElementId, optionComboId );
        } );

        $( this ).keyup( function( event )
        {
            keyPress( event, this );
        } );

        if ( ( type === 'DATE' || type === 'DATETIME' ) && !isTimeField )
        {
            // Fake event, needed for valueBlur / valueFocus when using date-picker
            var fakeEvent = {
                target: {
                    id: id + '-dp'
                }
            };

            dhis2.period.picker.createInstance( '#' + id, false, false, {
                onSelect: function() {
                    saveVal( dataElementId, optionComboId, id, fakeEvent.target.id );
                },
                onClose: function() {
                    valueBlur( fakeEvent );
                },
                onShow: function() {
                    valueFocus( fakeEvent );
                },
                minDate: null,
                maxDate: null
            } );
        }
    } );

    $( '.entryselect' ).each( function()
    {
        var id = $( this ).attr( 'id' );
        var split = dhis2.de.splitFieldId( id );

        var dataElementId = split.dataElementId;
        var optionComboId = split.optionComboId;
        var name = dataElementId + "-" + optionComboId + "-val";

        $( this ).unbind( 'click' );
        
        $( this ).click( function()
        {
            if ( $(this).hasClass( "checked" ) )
            {
                $( this ).removeClass( "checked" );
                $( this ).prop('checked', false );
            }
            else
            {
                $(  '[name='+ name +']' ).each( function()
                {
                    $( this ).removeClass( 'checked' );
                    $( this ).prop( 'checked', false );
                });

                $( this ).prop( 'checked', true );
                $( this ).addClass( 'checked' );
            }

            saveBoolean( dataElementId, optionComboId, id );
        } );
    } );

    $( '.entrytrueonly' ).each( function( i )
    {
        var id = $( this ).attr( 'id' );
        var split = dhis2.de.splitFieldId( id );

        var dataElementId = split.dataElementId;
        var optionComboId = split.optionComboId;

        $( this ).unbind( 'focus' );
        $( this ).unbind( 'change' );

        $( this ).focus( valueFocus );
        $( this ).blur( valueBlur );

        $( this ).change( function()
        {
            saveTrueOnly( dataElementId, optionComboId, id );
        } );
    } );

    $( '.commentlink' ).each( function( i )
    {
        var id = $( this ).attr( 'id' );
        var split = dhis2.de.splitFieldId( id );

        var dataElementId = split.dataElementId;
        var optionComboId = split.optionComboId;

        $( this ).unbind( 'click' );

        $( this ).attr( "src", "../images/comment.png" );
        $( this ).attr( "title", i18n_view_comment );

        $( this ).css( "cursor", "pointer" );

        $( this ).click( function()
        {
            viewHist( dataElementId, optionComboId );
        } );
    } );

    $( '.entryfileresource' ).each( function()
    {
        $( this ).fileEntryField();
    } );
}

dhis2.de.resetSectionFilters = function()
{
    // ToDo(plugin): should this make a call to the parent (need custom form with custom forms)
    // $( '#filterDataSetSectionDiv' ).hide();
    // $( '.formSection' ).show();
}

dhis2.de.clearSectionFilters = function()
{
    // ToDo(plugin): should this make a call to the parent (need custom form with custom forms)
    // $( '#filterDataSetSection' ).children().remove();
    // $( '#filterDataSetSectionDiv' ).hide();
    // $( '.formSection' ).show();
}

dhis2.de.clearPeriod = function()
{
    // ToDo(plugin): should this make a call to the parent?
    // clearListById( 'selectedPeriodId' );
    // dhis2.de.clearEntryForm();
}

/**
 * @deprecated
 */
dhis2.de.clearEntryForm = function()
{
    warnDeprecate('dhis2.de.clearEntryForm')
}

dhis2.de.loadForm = function()
{
    var dataSetId = dhis2.de.currentDataSetId;
    console.log(`[custom-forms] dhis2.de.loadForm - dataSetId: "${dataSetId}"`)
	
    $( "#tabs" ).tabs({
        activate: function(){
            // ToDo(custom-forms): need to find sample forms to test these
            //populate section row/column totals
            dhis2.de.populateRowTotals();
            dhis2.de.populateColumnTotals();
        }
    });

	// dhis2.de.currentOrganisationUnitId = selection.getSelected()[0];
    console.log('[custom-forms] dhis2.de.currentOrganisationUnitId', dhis2.de.currentOrganisationUnitId)
    console.log('[custom-forms] dhis2.de.currentDataSetId', dhis2.de.currentDataSetId)
    $( document ).trigger( dhis2.de.event.formLoaded, dhis2.de.currentDataSetId );
    // dhis2.de.manageOfflineData();

    dataSetSelected();
    loadDataValues();
    var table = $( '.sectionTable' );
    table.floatThead({
        position: 'absolute',
        top: 44,
        zIndex: 9
    });

    // ToDo(plugin) re-check the scope of the original loadForm and see if functionality missing
    // dhis2.de.insertOptionSets();
    //               dhis2.de.enableDEDescriptionEvent();
}

//------------------------------------------------------------------------------
// Supportive methods
//------------------------------------------------------------------------------

/**
 * Splits an id based on the multi org unit variable.
 */
dhis2.de.splitFieldId = function( id )
{
    var split = {};

    if ( dhis2.de.multiOrganisationUnit )
    {
        split.organisationUnitId = id.split( '-' )[0];
        split.dataElementId = id.split( '-' )[1];
        split.optionComboId = id.split( '-' )[2];
    }
    else
    {
        split.organisationUnitId = dhis2.de.getCurrentOrganisationUnit();
        split.dataElementId = id.split( '-' )[0];
        split.optionComboId = id.split( '-' )[1];
    }

    return split;
}

function refreshZebraStripes( $tbody )
{
    $tbody.find( 'tr:not([colspan]):visible:even' ).find( 'td:first-child' ).removeClass( 'reg alt' ).addClass( 'alt' );
    $tbody.find( 'tr:not([colspan]):visible:odd' ).find( 'td:first-child' ).removeClass( 'reg alt' ).addClass( 'reg' );
}

function getDataElementType( dataElementId )
{
	if ( dhis2.de.dataElements[dataElementId] != null )
	{
		return dhis2.de.dataElements[dataElementId];
	}

	console.log( 'Data element not present in data set, falling back to default type: ' + dataElementId );
	return dhis2.de.cst.defaultType;
}

function getDataElementName( dataElementId )
{
	var span = $( '#' + dataElementId + '-dataelement' );

	if ( span != null )
	{
		return span.text();
	}

    console.log( 'Data element not present in form, falling back to default name: ' + dataElementId );
	return dhis2.de.cst.defaultName;
}

function getOptionComboName( optionComboId )
{
	var span = $( '#' + optionComboId + '-optioncombo' );

	if ( span != null )
	{
		return span.text();
	}

    console.log( 'Category option combo not present in form, falling back to default name: ' + optionComboId );
	return dhis2.de.cst.defaultName;
}

function arrayChunk( array, size )
{
    if ( !array || !array.length )
    {
        return [];
    }

    if ( !size || size < 1 )
    {
        return array;
    }

    var groups = [];
    var chunks = array.length / size;
    for ( var i = 0, j = 0; i < chunks; i++, j += size )
    {
        groups[i] = array.slice(j, j + size);
    }

    return groups;
}

/**
 * Fetch data-sets for a orgUnit + data-sets for its children.
 *
 * @deprecated datasets are provided by the parent to the plugin and the plugin is refreshed when selection changes
 */
dhis2.de.fetchDataSets = function( ou )
{
    warnDeprecate('dhis2.de.fetchDataSets', 'The method now just returns the datasets passed to the plugin by the parent.')

    var def = $.Deferred();
    
    def.resolve(dhis2.shim.metadata.dataSets)

    return def.promise();
};

/**
 * @deprecated
 */
dhis2.de.getOrFetchDataSetList = function( ou ) {
    warnDeprecate('dhis2.de.getOrFetchDataSetList')
};

/**
 * Returns an array containing associative array elements with id and name
 * properties. The array is sorted on the element name property.
 * 
 * @deprecated
 */
function getSortedDataSetList( orgUnit )
{
    warnDeprecate('getSortedDataSetList', 'the method now just returns the sorted list of datasets passed to the plugin.')
    //!(plugin) do we need to do these operations by orgUnit?
    const dataSets = window.dhis2.shim.metadata?.dataSets
    
    dataSets?.sort( function( a, b )
    {
        return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    } );

    return dataSets;
}

/**
 * Gets list of data sets for selected organisation units.
 * 
 * @deprecated
 */
function getSortedDataSetListForOrgUnits()
{
    warnDeprecate('getSortedDataSetListForOrgUnits')
}

// -----------------------------------------------------------------------------
// DataSet Selection
// -----------------------------------------------------------------------------

/**
 * Callback for changes in data set list. For previous selection to be valid and
 * the period selection to remain, the period type of the previous data set must
 * equal the current data set, and the allow future periods property of the previous
 * data set must equal the current data set or the current period offset must not
 * be in the future.
 */
function dataSetSelected()
{
    dhis2.de.currentDataSetId = $( '#selectedDataSetId' ).val();
    dhis2.de.currentCategories = dhis2.de.getCategories( dhis2.de.currentDataSetId );

    
    // ! all period blocking and navigation logic removed as it is in the parent app now
    // ! test allow future periods
    
}

//------------------------------------------------------------------------------
// Attributes / Categories Selection
//------------------------------------------------------------------------------

/**
* Returns an array of category objects for the given data set identifier. Categories
* are looked up using the category combo of the data set. Null is returned if
* the given data set has the default category combo.
*/
dhis2.de.getCategories = function( dataSetId )
{
	var dataSet = dhis2.de.dataSets[dataSetId];
	
	if ( !dataSet || !dataSet.categoryCombo || dhis2.de.defaultCategoryCombo === dataSet.categoryCombo ) {
		return null;
	}

	var categoryCombo = dhis2.de.categoryCombos[dataSet.categoryCombo?.id];
	
	var categories = [];
	$.safeEach( categoryCombo.categories, function( idx, cat ) {
		var category = dhis2.de.categories[cat];
        // ! plugin-shim:  add options with categoryOptions similar to old data entry
        category.options = category.categoryOptions.map(co =>  {
            const result = window.dhis2.shim?.metadata?.categoryOptions?.[co]
            return result
        })
		categories.push( category );
	} );
	
	return categories;
};

/**
 * Indicates whether all present categories have been selected. True is returned
 * if no categories are present. False is returned if less selections have been
 * made thant here are categories present.
 */
dhis2.de.categoriesSelected = function()
{
	if ( !dhis2.de.currentCategories || dhis2.de.currentCategories.length == 0 ) {
		return true; // No categories present which can be selected
	}
	
	var options = dhis2.de.getCurrentCategoryOptions();
	
	if ( !options || options.length < dhis2.de.currentCategories.length ) {
		return false; // Less selected options than categories present
	}
	
	return true;
};

/**
* Returns attribute category combo identifier. Based on the dhis2.de.currentDataSetId 
* global variable. Returns null if there is no current data set or if current 
* data set has the default category combo.
*/
dhis2.de.getCurrentCategoryCombo = function()
{
    var dataSet = dhis2.de.dataSets[dhis2.de.currentDataSetId];
	if ( !dataSet || !dataSet.categoryCombo?.id || dhis2.de.defaultCategoryCombo === dataSet.categoryCombo?.id ) {
		return null;
	}
	
    // !updated in the plugin as  dataSet.categoryCombo is now an object NOT an ID
	return dataSet.categoryCombo?.id;
};

/**
* Returns an array of the currently selected attribute category option identifiers. 
* Based on the dhis2.de.currentCategories global variable. Returns null if there 
* are no current categories.
*/
dhis2.de.getCurrentCategoryOptions = function()
{
	if ( !dhis2.de.currentCategories || dhis2.de.currentCategories.length == 0 ) {
		return null;
	}
	
	var options = [];
    // !(plugin) shim adds these attribute option combos as hidden inputs so code like this continues to work
	$.safeEach( dhis2.de.currentCategories, function( idx, category ) {
		var option = $( '#category-' + category.id ).val();
		
		if ( option && option != -1 ) {
			options.push( option );
		}
	} );
	
	return options;
};

/**
 * Returns an object for the currently selected attribute category options
 * with properties for the identifiers of each category and matching values
 * for the identifier of the selected category option. Returns an empty
 * object if there are no current categories.
 */
dhis2.de.getCurrentCategorySelections = function()
{
	var selections = {};
	
	if ( !dhis2.de.currentCategories || dhis2.de.currentCategories.length == 0 ) {
		return selections;
	}
		
	$.safeEach( dhis2.de.currentCategories, function( idx, category ) {
		var option = $( '#category-' + category.id ).val();
		
		if ( option && option != -1 ) {
			selections[category.id] = option;
		}
	} );
	
	return selections;
}

/**
 * Returns a query param value for the currently selected category options where
 * each option is separated by the ; character.
 */
dhis2.de.getCurrentCategoryOptionsQueryValue = function()
{
    if ( !dhis2.de.getCurrentCategoryOptions() ) {
        return null;
	}
	
	var value = '';
	
	$.safeEach( dhis2.de.getCurrentCategoryOptions(), function( idx, option ) {
        value += option + ';';
	} );

	if ( value ) {
		value = value.slice( 0, -1 );
	}
	
	return value;
}

/**
 * Tests to see if a category option is valid during a period.
 */
dhis2.de.optionValidWithinPeriod = function( option, period )
{
    var optionStartDate, optionEndDate;

    if ( option.start ) {
        optionStartDate = dhis2.period.calendar.parseDate( dhis2.period.format, option.start );
    }

    if ( option.end ) {
        optionEndDate = dhis2.period.calendar.parseDate( dhis2.period.format, option.end );
        var ds = dhis2.de.dataSets[dhis2.de.currentDataSetId];
        if ( ds.openPeriodsAfterCoEndDate ) {
            optionEndDate = dhis2.period.generator.datePlusPeriods( ds.periodType, optionEndDate, parseInt( ds.openPeriodsAfterCoEndDate ) );
        }
    }

    var periodStartDate = dhis2.period.calendar.parseDate( dhis2.period.format, dhis2.de.periodChoices[ period ].startDate );
    var periodEndDate = dhis2.period.calendar.parseDate( dhis2.period.format, dhis2.de.periodChoices[ period ].endDate );

    return ( !optionStartDate || optionStartDate <= periodEndDate )
        && ( !optionEndDate || optionEndDate >= periodStartDate )
}

/**
 * Tests to see if attribute category option is valid for the selected org unit.
 */
dhis2.de.optionValidForSelectedOrgUnit = function( option )
{
    var isValid = true;

    if (option.ous && option.ous.length) {
        isValid = false;
        var path = organisationUnits[dhis2.de.getCurrentOrganisationUnit()].path;
        $.safeEach(option.ous, function (idx, uid) {
            if (path.indexOf(uid) >= 0) {
                isValid = true;
                return false;
            }
        });
    }

    return isValid;
}

/**
 * This is now handled by context selection in the parent
 * 
 * @deprecated
 */
dhis2.de.setAttributesMarkup = function()
{
    warnDeprecate('dhis2.de.setAttributesMarkup')
}

/**
* @deprecated
*/
dhis2.de.getAttributesMarkup = function()
{
    warnDeprecate('dhis2.de.getAttributesMarkup')
};

/**
 * Clears the markup for attribute select lists.
 */
dhis2.de.clearAttributes = function()
{
    // ToDo(plugin): proxy this method to parent
	$( '#attributeComboDiv' ).html( '' );
};

/**
 * @deprecated
 */
dhis2.de.attributeSelected = function( categoryId )
{
    warnDeprecate('dhis2.de.attributeSelected')

};

// -----------------------------------------------------------------------------
// Form
// -----------------------------------------------------------------------------

/**
 * Indicates whether all required input selections have been made.
 * 
 * @deprecated this is now handled by context selection for the plugin
 */
dhis2.de.inputSelected = function()
{
    warnDeprecate('dhis2.de.inputSelected')
};

function loadDataValues()
{
    console.log('[custom-forms]: loadDataValues')
    // dhis2.de.currentOrganisationUnitId = selection.getSelected()[0];

    getAndInsertDataValues();
    displayEntryFormCompleted();
}

function clearFileEntryFields() {
    var $fields = $( '.entryfileresource' );
    $fields.find( '.upload-fileinfo-name' ).text( '' );
    $fields.find( '.upload-fileinfo-size' ).text( '' );

    $fields.find( '.upload-field' ).css( 'background-color', dhis2.de.cst.colorWhite );
    $fields.find( 'input' ).val( '' );
    
    // ToDo: do we want to include select2? https://select2.org/ 
    // $('.select2-container').select2("val", "");
}

function getAndInsertDataValues()
{
    var periodId = $( '#selectedPeriodId').val();
    var dataSetId = $( '#selectedDataSetId' ).val();

    // Clear existing values and colors, grey disabled fields
    console.log(`[custom-forms](getAndInsertDataValues) periodId "${periodId}" | dataSetId "${dataSetId}"`)
    
    $( '.entryfield' ).val( '' );
    $( '.entrytime' ).val( '' );
    $( '.entryselect' ).each( function()
    {
        $( this ).removeClass( 'checked' );
        $( this ).prop( 'checked', false );
        
    } );
    $( '.entrytrueonly' ).prop( 'checked', false );
    $( '.entrytrueonly' ).prop( 'onclick', null );
    $( '.entrytrueonly' ).prop( 'onkeydown', null );

    $( '.entryfield' ).css( 'background-color', dhis2.de.cst.colorWhite ).css( 'border', '1px solid ' + dhis2.de.cst.colorBorder );
    $( '.entryselect' ).css( 'background-color', dhis2.de.cst.colorWhite ).css( 'border', '1px solid ' + dhis2.de.cst.colorBorder );
    $( '.indicator' ).css( 'background-color', dhis2.de.cst.colorLightGrey  ).css( 'border', '1px solid ' + dhis2.de.cst.colorBorder );
    $( '.entrytrueonly' ).css( 'background-color', dhis2.de.cst.colorWhite );    

    clearFileEntryFields();

    $( '[name="min"]' ).html( '' );
    $( '[name="max"]' ).html( '' );

    $( '.entryfield' ).filter( ':disabled' ).css( 'background-color', dhis2.de.cst.colorGrey );

    var params = {
		pe : periodId,
        ds : dataSetId,
        // dataElementId: dataElementId,
        ou : dhis2.de.getCurrentOrganisationUnit(),
        // multiOrganisationUnit: dhis2.de.multiOrganisationUnit
    };

    var cc = dhis2.de.getCurrentCategoryCombo();
    var cp = dhis2.de.getCurrentCategoryOptionsQueryValue();
    
    if ( cc && cp )
    {
    	params.cc = cc;
    	params.cp = cp;
    }
    
    $.ajax( {
    	url: '/api/dataEntry/dataValues',
    	data: params,
	    dataType: 'json',
	    error: function() // offline
	    {
	    	$( '#completenessDiv' ).show();
	    	$( '#infoDiv' ).hide();
	    	
	    	var json = getOfflineDataValueJson( params );
	    	insertDataValues( json );
	    },
	    success: function( json ) // online
	    {
	    	insertDataValues( json );
        },
        complete: function()
        {
            $( '.indicator' ).attr( 'readonly', 'readonly' );
            $( '.dataelementtotal' ).attr( 'readonly', 'readonly' );
            $( document ).trigger( dhis2.de.event.dataValuesLoaded, dhis2.de.currentDataSetId );
                     
            //populate section row/column totals
            dhis2.de.populateRowTotals();
            dhis2.de.populateColumnTotals();
        }
	} );
}

function getOfflineDataValueJson( params )
{
	var dataValues = dhis2.de.storageManager.getDataValuesInForm( params );
	var complete = dhis2.de.storageManager.hasCompleteDataSet( params );
	
	var json = {};
	json.dataValues = new Array();
	json.locked = 'OPEN';
	json.complete = complete;
	json.date = "";
	json.storedBy = "";
    json.lastUpdatedBy = "";
		
	for ( var i = 0; i < dataValues.length; i++ )
	{
		var dataValue = dataValues[i];
		
		json.dataValues.push( { 
			'id': dataValue.de + '-' + dataValue.co,
			'val': dataValue.value
		} );
	}
	
	return json;
}

function insertDataValues( json )
{
    var dataValueMap = []; // Reset
    dhis2.de.currentMinMaxValueMap = []; // Reset
    
    var period = dhis2.de.getSelectedPeriod();
    
    var dataSet = dhis2.de.dataSets[dhis2.de.currentDataSetId];
    
    var periodLocked = false;
    
    if ( dataSet && dataSet.expiryDays > 0 )
    {
        var serverTimeDelta = dhis2.de.storageManager.getServerTimeDelta() || 0;
        var maxDate = moment( period.endDate, dhis2.period.format.toUpperCase() ).add( parseInt(dataSet.expiryDays), 'day' );
        periodLocked = moment().add( serverTimeDelta, 'ms' ).isAfter( maxDate );
    }

    // var lockExceptionId = dhis2.de.currentOrganisationUnitId + "-" + dhis2.de.currentDataSetId + "-" + period.iso;

    // periodLocked = periodLocked && dhis2.de.lockExceptions.indexOf( lockExceptionId ) == -1;

    // if ( json.locked !== 'OPEN' || dhis2.de.blackListedPeriods.indexOf( period.iso ) > -1 || periodLocked )
	// {
		// dhis2.de.lockForm();

	// 	if ( periodLocked ) {
	// 		setHeaderDelayMessage( i18n_dataset_is_concluded );
	// 	} else if ( dhis2.de.blackListedPeriods.indexOf( period.iso ) > -1 ) {
	// 		setHeaderDelayMessage( i18n_dataset_is_closed );
	// 	} else if ( json.locked === 'APPROVED' ) {
	// 		setHeaderDelayMessage( i18n_dataset_is_approved );
	// 	} else {
	// 		setHeaderDelayMessage( i18n_dataset_is_locked );
	// 	}

	// }
	// else
	// {
    //     $( '#contentDiv input' ).removeAttr( 'readonly' );
    //     $( '#contentDiv textarea' ).removeAttr( 'readonly' );
	// 	$( '#completenessDiv' ).show();
	// }

    // // Set the data-disabled attribute on any file upload fields
    // $( '#contentDiv .entryfileresource' ).data( 'disabled', json.locked !== 'OPEN' );

    // Set data values, works for selects too as data value=select value    
    if ( !dhis2.de.multiOrganisationUnit  )
    {	
    	if ( period )
		{    
    		if ( dhis2.de.validateOrgUnitOpening( organisationUnits[dhis2.de.getCurrentOrganisationUnit()], period ) )
    		{
    			dhis2.de.lockForm();
            setHeaderDelayMessage( i18n_orgunit_is_closed );
    	        return;
    		}
    	}
    }
    
    $.safeEach( json.dataValues, function( i, value )
    {
        /**
         * [custom-forms]
         * some workarounds here to be able to work with the formats returned from the legacy '/dhis-web-dataentry/getDataValues.action'
         * as well as '/api/dataEntry/dataValues'
         */
        var id = value.id ?? (value.dataElement + '-' + value.categoryOptionCombo)
        var fieldId = '#' + id + '-val';
        var commentId = '#' + id + '-comment';
        var valueToShow = value.val ?? value.value
        if ( $( fieldId ).length > 0 ) // Set values
        {
            var entryField = $( fieldId );
            if ( 'true' == valueToShow && ( entryField.attr( 'name' ) == 'entrytrueonly' || entryField.hasClass( "entrytrueonly" ) ) )
            {
              $( fieldId ).prop( 'checked', true );
            }
            else if ( entryField.attr( 'name' ) == 'entryoptionset' || entryField.hasClass( "entryoptionset" ) )
            {
                dhis2.de.setOptionNameInField( fieldId, value );
            }
            else if ( entryField.hasClass( 'entryselect' ) )
            {                
                var fId = fieldId.substring(1, fieldId.length);
    
                if( valueToShow == 'true' )
                {
                  $('input[id=' + fId + ']:nth(0)').prop( 'checked', true );
                  $('input[id=' + fId + ']:nth(0)').addClass( 'checked' );
                }
                else if ( valueToShow == 'false')
                {
                  $('input[id=' + fId + ']:nth(1)').prop( 'checked', true );
                  $('input[id=' + fId + ']:nth(1)').addClass( 'checked' );
                }
                else{
                    $('input[id=' + fId + ']:nth(0)').prop( 'checked', false );
                    $('input[id=' + fId + ']:nth(1)').prop( 'checked', false );
                }
            }
            else if ( entryField.attr( 'class' ) == 'entryfileresource' )
            {
                var $field = $( fieldId );

                $field.find( 'input[class="entryfileresource-input"]' ).val( value.val );

                var split = dhis2.de.splitFieldId( value.id );

                var dvParams = {
                    'de': split.dataElementId,
                    'co': split.optionComboId,
                    'ou': split.organisationUnitId,
                    'pe': $( '#selectedPeriodId' ).val(),
                    'ds': $( '#selectedDataSetId' ).val()
                };

                var cc = dhis2.de.getCurrentCategoryCombo();
                var cp = dhis2.de.getCurrentCategoryOptionsQueryValue();

                if( cc && cp )
                {
                    dvParams.cc = cc;
                    dvParams.cp = cp;
                }

                var name = "", size = "";

                if ( value.fileMeta )
                {
                    name = value.fileMeta.name;
                    size = '(' + filesize( value.fileMeta.size ) + ')';
                }
                else
                {
                    name = i18n_loading_file_info_failed;
                }

                var $filename = $field.find( '.upload-fileinfo-name' );

                $( '<a>', {
                    text: name,
                    title: name,
                    target: '_blank',
                    href: "../api/dataValues/files?" + $.param( dvParams )
                } ).appendTo( $filename );

                $field.find( '.upload-fileinfo-size' ).text( size );
            }
            else if ( $( fieldId.replace('val', 'time') ).length > 0 )
            {
                $( fieldId ).val( value.val );
                $( fieldId.replace('val', 'time') ).val( value.val.split('T')[1] );
            }
            else 
            {                
                $( fieldId ).val( valueToShow );
            }
        }
        
        if ( 'true' == value.com ) // Set active comments
        {
            if ( $( commentId ).length > 0 )
            {
                $( commentId ).attr( 'src', '../images/comment_active.png' );
            }
            else if ( $( fieldId ).length > 0 )
            {
                $( fieldId ).css( 'border-color', dhis2.de.cst.colorBorderActive )
            }
        }
        
        dataValueMap[value.id] = value.val;

        // ToDO: what is this????
        // dhis2.period.picker.updateDate(fieldId);
        
    } );

    // Set min-max values and colorize violation fields

    if ( json.locked === 'OPEN' )
    {
        $.safeEach( json.minMaxDataElements, function( i, value )
        {
            var minId = value.id + '-min';
            var maxId = value.id + '-max';

            var valFieldId = '#' + value.id + '-val';

            var dataValue = dataValueMap[value.id];

            if ( dataValue && ( ( value.min && new Number( dataValue ) < new Number(
                value.min ) ) || ( value.max && new Number( dataValue ) > new Number( value.max ) ) ) )
            {
                $( valFieldId ).css( 'background-color', dhis2.de.cst.colorOrange );
            }

            dhis2.de.currentMinMaxValueMap[minId] = value.min;
            dhis2.de.currentMinMaxValueMap[maxId] = value.max;
        } );
    }

    // Update indicator values in form

    dhis2.de.updateIndicators();
    dhis2.de.updateDataElementTotals();
}

function displayEntryFormCompleted()
{
    dhis2.de.addEventListeners();

    dhis2.de.dataEntryFormIsLoaded = true;
    // hideLoader();
    
    $( document ).trigger( dhis2.de.event.formReady, dhis2.de.currentDataSetId );
}

function valueFocus( e )
{
    var id = e.target.id;
    var value = e.target.value;

    var split = dhis2.de.splitFieldId( id );
    var dataElementId = split.dataElementId;
    dhis2.de.currentOrganisationUnitId = split.organisationUnitId;
    dhis2.de.currentExistingValue = value;

    $( '#' + dataElementId + '-cell' ).addClass( 'currentRow' );
}

function valueBlur( e )
{
    var id = e.target.id;

    var split = dhis2.de.splitFieldId( id );
    var dataElementId = split.dataElementId;

    $( '#' + dataElementId + '-cell' ).removeClass( 'currentRow' );
}

function keyPress( event, field )
{
    var key = event.keyCode || event.charCode || event.which;

    var focusField = ( key == 13 || key == 40 ) ? getNextEntryField( field )
            : ( key == 38 ) ? getPreviousEntryField( field ) : false;

    if ( focusField )
    {
        focusField.focus();
    }
}

function getNextEntryField( field )
{
    var index = field.getAttribute( 'tabindex' );

    field = $( 'input[name="entryfield"][tabindex="' + ( ++index ) + '"]' );

    while ( field )
    {
        if ( field.is( ':disabled' ) || field.is( ':hidden' ) )
        {
            field = $( 'input[name="entryfield"][tabindex="' + ( ++index ) + '"]' );
        }
        else
        {
            return field;
        }
    }
}

function getPreviousEntryField( field )
{
    var index = field.getAttribute( 'tabindex' );

    field = $( 'input[name="entryfield"][tabindex="' + ( --index ) + '"]' );

    while ( field )
    {
        if ( field.is( ':disabled' ) || field.is( ':hidden' ) )
        {
            field = $( 'input[name="entryfield"][tabindex="' + ( --index ) + '"]' );
        }
        else
        {
            return field;
        }
    }
}


// -----------------------------------------------------------------------------
// Local storage of forms
// -----------------------------------------------------------------------------

function updateForms()
{
    DAO.store.open()
        .then(purgeLocalForms)
        .then(getLocalFormsToUpdate)
        .then(downloadForms)
        .then(getUserSetting)
        .then(getTimeDelta)
        .then(getRemoteFormsToDownload)
        .then(downloadForms)
        .then(dhis2.de.loadOptionSets)
        .done( function() {
            setDisplayNamePreferences();

            selection.responseReceived();
        } );
}

function setDisplayNamePreferences() {
    var settings = dhis2.de.storageManager.getUserSettings();
    var useShortNames = true;

    if ( settings !== null ) {
        useShortNames = settings.keyAnalysisDisplayProperty === "shortName";
    }

    selection.setDisplayShortNames(useShortNames);
}

function purgeLocalForms()
{
    var def = $.Deferred();

    dhis2.de.storageManager.getAllForms().done(function( formIds ) {
        var keys = [];

        $.safeEach( formIds, function( idx, item )
        {
            if ( dhis2.de.dataSets[item] == null )
            {
                keys.push(item);
            	dhis2.de.storageManager.deleteFormVersion( item );
                console.log( 'Deleted locally stored form: ' + item );
            }
        } );

        def.resolve();

        console.log( 'Purged local forms' );
    });

    return def.promise();
}

function getLocalFormsToUpdate()
{
    var def = $.Deferred();
    var formsToDownload = [];

    dhis2.de.storageManager.getAllForms().done(function( formIds ) {
        var formVersions = dhis2.de.storageManager.getAllFormVersions();

        $.safeEach( formIds, function( idx, item )
        {
            var ds = dhis2.de.dataSets[item];
            var remoteVersion = ds ? ds.version : null;
            var localVersion = formVersions[item];

            if ( remoteVersion == null || localVersion == null || remoteVersion != localVersion )
            {
            	formsToDownload.push({id: item, version: remoteVersion});
            }
        } );

        def.resolve( formsToDownload );
    });

    return def.promise();
}

function getRemoteFormsToDownload()
{
    var def = $.Deferred();
    var formsToDownload = [];

    $.safeEach( dhis2.de.dataSets, function( idx, item )
    {
        var remoteVersion = item.version;

        if ( !item.skipOffline )
        {
            dhis2.de.storageManager.formExists( idx ).done(function( value ) {
                if( !value ) {
                	formsToDownload.push({id: idx, version: remoteVersion})
                }
            });
        }
    } );

    $.when.apply($, formsToDownload).then(function() {
        def.resolve( formsToDownload );
    });

    return def.promise();
}

function downloadForms( forms )
{
    if ( !forms || !forms.length || forms.length < 1 )
    {
        return;
    }

    var batches = arrayChunk( forms, dhis2.de.cst.downloadBatchSize );

    var mainDef = $.Deferred();
    var mainPromise = mainDef.promise();

    var batchDef = $.Deferred();
    var batchPromise = batchDef.promise();

    var builder = $.Deferred();
    var build = builder.promise();

    $.safeEach( batches, function ( idx, batch ) {
        batchPromise = batchPromise.then(function(){
            return downloadFormsInBatch( batch );
        });
    });

    build.done(function() {
        batchDef.resolve();
        batchPromise = batchPromise.done( function () {
            mainDef.resolve();
        } );

    }).fail(function(){
        mainDef.resolve();
    });

    builder.resolve();

    return mainPromise;
}

function downloadFormsInBatch( batch )
{
    var def = $.Deferred();
    var chain = [];

    $.safeEach( batch, function ( idx, item ) {
        if ( item && item.id && item.version )
        {
            chain.push( dhis2.de.storageManager.downloadForm( item.id, item.version ) );
        }
    });

    $.when.apply($, chain).then(function() {
    	def.resolve( chain );
    });

    return def.promise();
}
// -----------------------------------------------------------------------------
// StorageManager
// -----------------------------------------------------------------------------

/**
 * This object provides utility methods for localStorage and manages data entry
 * forms and data values.
 */
function StorageManager()
{
    var KEY_FORM_VERSIONS = 'formversions';
    var KEY_DATAVALUES = 'datavalues';
    var KEY_COMPLETEDATASETS = 'completedatasets';
    var KEY_USER_SETTINGS = 'usersettings';
    var KEY_SERVER_TIME_DELTA = 'servertimedelta';
    var KEY_SERVER_TIME_RETRIEVED = 'servertimeretrieved';

    /**
     * Gets the content of a data entry form.
     *
     * @param dataSetId the identifier of the data set of the form.
     * @return the content of a data entry form.
     */
    this.getForm = function( dataSetId )
    {
        var def = $.Deferred();

        DAO.store.get( "forms", dataSetId ).done( function( form ) {
            if( typeof form !== 'undefined' ) {
                def.resolve( form.data );
            } else {
                dhis2.de.storageManager.loadForm( dataSetId ).done(function( data ) {
                    def.resolve( data );
                }).fail(function() {
                    def.resolve( "A form with that ID is not available. Please clear browser cache and try again." );
                });
            }
        });

        return def.promise();
    };

    /**
     * Returns an array of the identifiers of all forms.
     *
     * @return array with form identifiers.
     */
    this.getAllForms = function()
    {
        var def = $.Deferred();

        DAO.store.getKeys( "forms" ).done( function( keys ) {
            def.resolve( keys );
        });

        return def.promise();
    };

    /**
     * Indicates whether a form exists.
     *
     * @param dataSetId the identifier of the data set of the form.
     * @return true if a form exists, false otherwise.
     */
    this.formExists = function( dataSetId )
    {
        var def = $.Deferred();

        DAO.store.contains( "forms", dataSetId ).done( function( found ) {
            def.resolve( found );
        });

        return def.promise();
    };

    /**
     * Indicates whether a form exists remotely.
     *
     * @param dataSetId the identifier of the data set of the form.
     * @return true if a form exists, false otherwise.
     */
    this.formExistsRemotely = function( dataSetId )
    {
        var def = $.Deferred();

        $.ajax({
            url: '../api/dataSets/' + dataSetId,
            accept: 'application/json',
            type: 'GET'
        }).done(function() {
            def.resolve( true );
        }).fail(function() {
            def.resolve( false );
        });

        return def.promise();
    };

    /**
     * Loads a form directly from the server, does not try to save it in the
     * browser (so that it doesn't interfere with any current downloads).
     *
     * @param dataSetId
     * @returns {*}
     */
    this.loadForm = function( dataSetId )
    {
        warnDeprecate('StoreManager.loadForm')
    };

    /**
     * Downloads the form for the data set with the given identifier from the
     * remote server and saves the form locally. Potential existing forms with
     * the same identifier will be overwritten. Updates the form version.
     *
     * @param dataSetId the identifier of the data set of the form.
     * @param formVersion the version of the form of the remote data set.
     */
    this.downloadForm = function( dataSetId, formVersion )
    {
        var def = $.Deferred();
        
        console.log( 'Starting download of form: ' + dataSetId );

        $.ajax( {
            url: 'loadForm.action',
            data:
            {
                dataSetId : dataSetId
            },
            dataSetId: dataSetId,
            formVersion: formVersion,
            dataType: 'text',
            success: function( data )
            {
                var dataSet = {
                    id: dataSetId,
                    version: formVersion,
                    data: data
                };

                DAO.store.set( "forms", dataSet ).done(function() {
                    console.log( 'Successfully stored form: ' + dataSetId );
                    def.resolve();
                });

            	dhis2.de.storageManager.saveFormVersion( this.dataSetId, this.formVersion );
            }
        } );

        return def.promise();
    };

    /**
     * Saves a version for a form.
     *
     * @param dataSetId the identifier of the data set of the form.
     * @param formVersion the version of the form.
     */
    this.saveFormVersion = function( dataSetId, formVersion )
    {
        var formVersions = {};

        if ( localStorage[KEY_FORM_VERSIONS] != null )
        {
            formVersions = JSON.parse( localStorage[KEY_FORM_VERSIONS] );
        }

        formVersions[dataSetId] = formVersion;

        try
        {
            localStorage[KEY_FORM_VERSIONS] = JSON.stringify( formVersions );

          console.log( 'Successfully stored form version: ' + dataSetId );
        } 
        catch ( e )
        {
          console.log( 'Max local storage quota reached, ignored form version: ' + dataSetId );
        }
    };

    /**
     * Returns the version of the form of the data set with the given
     * identifier.
     *
     * @param dataSetId the identifier of the data set of the form.
     * @return the form version.
     */
    this.getFormVersion = function( dataSetId )
    {
        if ( localStorage[KEY_FORM_VERSIONS] != null )
        {
            var formVersions = JSON.parse( localStorage[KEY_FORM_VERSIONS] );

            return formVersions[dataSetId];
        }

        return null;
    };

    /**
     * Deletes the form version of the data set with the given identifier.
     *
     * @param dataSetId the identifier of the data set of the form.
     */
    this.deleteFormVersion = function( dataSetId )
    {
    	if ( localStorage[KEY_FORM_VERSIONS] != null )
        {
            var formVersions = JSON.parse( localStorage[KEY_FORM_VERSIONS] );

            if ( formVersions[dataSetId] != null )
            {
                delete formVersions[dataSetId];
                localStorage[KEY_FORM_VERSIONS] = JSON.stringify( formVersions );
            }
        }
    };

    this.getAllFormVersions = function()
    {
        return localStorage[KEY_FORM_VERSIONS] != null ? JSON.parse( localStorage[KEY_FORM_VERSIONS] ) : null;
    };

    /**
     * Saves a data value.
     *
     * @param dataValue The datavalue and identifiers in json format.
     */
    this.saveDataValue = function( dataValue )
    {
        var id = this.getDataValueIdentifier( dataValue.de, 
        		dataValue.co, dataValue.pe, dataValue.ou );

        var dataValues = {};

        if ( localStorage[KEY_DATAVALUES] != null )
        {
            dataValues = JSON.parse( localStorage[KEY_DATAVALUES] );
        }

        dataValues[id] = dataValue;

        try
        {
            localStorage[KEY_DATAVALUES] = JSON.stringify( dataValues );

          console.log( 'Successfully stored data value' );
        } 
        catch ( e )
        {
          console.log( 'Max local storage quota reached, not storing data value locally' );
        }
    };

    /**
     * Gets the value for the data value with the given arguments, or null if it
     * does not exist.
     *
     * @param de the data element identifier.
     * @param co the category option combo identifier.
     * @param pe the period identifier.
     * @param ou the organisation unit identifier.
     * @return the value for the data value with the given arguments, null if
     *         non-existing.
     */
    this.getDataValue = function( de, co, pe, ou )
    {
        var id = this.getDataValueIdentifier( de, co, pe, ou );

        if ( localStorage[KEY_DATAVALUES] != null )
        {
            var dataValues = JSON.parse( localStorage[KEY_DATAVALUES] );

            return dataValues[id];
        }

        return null;
    };
    
    /**
     * Returns the data values for the given period and organisation unit 
     * identifiers as an array.
     * 
     * @param json object with periodId and organisationUnitId properties.
     */
    this.getDataValuesInForm = function( json )
    {
    	var dataValues = this.getDataValuesAsArray();
    	var valuesInForm = new Array();
    	
		for ( var i = 0; i < dataValues.length; i++ )
		{
			var val = dataValues[i];
			
			if ( val.pe == json.periodId && val.ou == json.organisationUnitId )
			{
				valuesInForm.push( val );
			}
		}
    	
    	return valuesInForm;
    }

    /**
     * Removes the given dataValue from localStorage.
     *
     * @param dataValue The datavalue and identifiers in json format.
     */
    this.clearDataValueJSON = function( dataValue )
    {
        this.clearDataValue( dataValue.de, dataValue.co, dataValue.pe,
                dataValue.ou );
    };

    /**
     * Removes the given dataValue from localStorage.
     *
     * @param de the data element identifier.
     * @param co the category option combo identifier.
     * @param pe the period identifier.
     * @param ou the organisation unit identifier.
     */
    this.clearDataValue = function( de, co, pe, ou )
    {
        var id = this.getDataValueIdentifier( de, co, pe, ou );
        var dataValues = this.getAllDataValues();

        if ( dataValues != null && dataValues[id] != null )
        {
            delete dataValues[id];
            localStorage[KEY_DATAVALUES] = JSON.stringify( dataValues );
        }
    };

    /**
     * Returns a JSON associative array where the keys are on the form <data
     * element id>-<category option combo id>-<period id>-<organisation unit
     * id> and the data values are the values.
     *
     * @return a JSON associative array.
     */
    this.getAllDataValues = function()
    {
        return localStorage[KEY_DATAVALUES] != null ? JSON.parse( localStorage[KEY_DATAVALUES] ) : null;
    };

    this.clearAllDataValues = function()
    {
        localStorage[KEY_DATAVALUES] = "";
    };

    /**
     * Returns all data value objects in an array. Returns an empty array if no
     * data values exist. Items in array are guaranteed not to be undefined.
     */
    this.getDataValuesAsArray = function()
    {
    	var values = new Array();
    	var dataValues = this.getAllDataValues();
    	
    	if ( undefined === dataValues )
    	{
    		return values;
    	}
    	
    	for ( i in dataValues )
    	{
    		if ( dataValues.hasOwnProperty( i ) && undefined !== dataValues[i] )
    		{
    			values.push( dataValues[i] );
    		}
    	}
    	
    	return values;
    }

    /**
     * Generates an identifier.
     */
    this.getDataValueIdentifier = function( de, co, pe, ou )
    {
        return de + '-' + co + '-' + pe + '-' + ou;
    };

    /**
     * Generates an identifier.
     */
    this.getCompleteDataSetId = function( json )
    {
        return json.ds + '-' + json.pe + '-' + json.ou;
    };

    /**
     * Returns current state in data entry form as associative array.
     *
     * @return an associative array.
     */
    this.getCurrentCompleteDataSetParams = function()
    {
        var params = {
            'ds': $( '#selectedDataSetId' ).val(),
            'pe': $( '#selectedPeriodId').val(),
            'ou': dhis2.de.getCurrentOrganisationUnit(),
            'multiOu': dhis2.de.multiOrganisationUnit
        };

        return params;
    };

    /**
     * Gets all complete data set registrations as JSON.
     *
     * @return all complete data set registrations as JSON.
     */
    this.getCompleteDataSets = function()
    {
        if ( localStorage[KEY_COMPLETEDATASETS] != null )
        {
            return JSON.parse( localStorage[KEY_COMPLETEDATASETS] );
        }

        return null;
    };

    /**
     * Saves a complete data set registration.
     *
     * @param json the complete data set registration as JSON.
     */
    this.saveCompleteDataSet = function( json )
    {
        var completeDataSets = this.getCompleteDataSets();
        var completeDataSetId = this.getCompleteDataSetId( json );

        if ( completeDataSets != null )
        {
            completeDataSets[completeDataSetId] = json;
        }
        else
        {
            completeDataSets = {};
            completeDataSets[completeDataSetId] = json;
        }

        try
        {
        	localStorage[KEY_COMPLETEDATASETS] = JSON.stringify( completeDataSets );
        }
        catch ( e )
        {
        	log( 'Max local storage quota reached, not storing complete registration locally' );
        }
    };
    
    /**
     * Indicates whether a complete data set registration exists for the given
     * argument.
     * 
     * @param json object with periodId, dataSetId, organisationUnitId properties.
     */
    this.hasCompleteDataSet = function( json )
    {
    	var id = this.getCompleteDataSetId( json );
    	var registrations = this.getCompleteDataSets();
    	
        if ( null != registrations && undefined !== registrations && undefined !== registrations[id] )
        {
            return true;
        }
    	
    	return false;
    }

    /**
     * Removes the given complete data set registration.
     *
     * @param json the complete data set registration as JSON.
     */
    this.clearCompleteDataSet = function( json )
    {
        var completeDataSets = this.getCompleteDataSets();
        var completeDataSetId = this.getCompleteDataSetId( json );

        if ( completeDataSets != null )
        {
            delete completeDataSets[completeDataSetId];

            if ( completeDataSets.length > 0 )
            {
                localStorage.removeItem( KEY_COMPLETEDATASETS );
            }
            else
            {
                localStorage[KEY_COMPLETEDATASETS] = JSON.stringify( completeDataSets );
            }
        }
    };

    /**
     * Returns the cached user settings
     */
    this.getUserSettings = function()
    {
        return localStorage[ KEY_USER_SETTINGS ] !== null 
            ? JSON.parse(localStorage[ KEY_USER_SETTINGS ])
            : null;
    }

    /**
     * Caches the user settings
     * @param settings The user settings object (JSON) to serialize into cache
     */
    this.setUserSettings = function(settings)
    {
        localStorage[ KEY_USER_SETTINGS ] = JSON.stringify(settings);
    }

    /**
     * Returns the cached server time delta
     */
    this.getServerTimeDelta = function()
    {
        // if it has been more than 1 hour since last update, pull server time again
        var lastRetrieved = this.getServerTimeRetrieved();
        if (lastRetrieved === null || (new Date() - lastRetrieved > 3600000)) {
            getTimeDelta();
        }
        return localStorage[ KEY_SERVER_TIME_DELTA ]
            ? JSON.parse(localStorage[ KEY_SERVER_TIME_DELTA ])
            : null;
    }

    /**
     * Caches the time difference between server time and browser time
     * @param timeDelta The time difference (server - client) in milliseconds (integer)
     */
    this.setServerTimeDelta = function(timeDelta)
    {
        localStorage[ KEY_SERVER_TIME_DELTA ] = timeDelta;
    }

    /**
     * Returns the cached time when server time delta was retrieved
     */
    this.getServerTimeRetrieved = function()
    {
        return localStorage[ KEY_SERVER_TIME_RETRIEVED ]
        ? parseInt(localStorage[ KEY_SERVER_TIME_RETRIEVED ])
        : null;
    }

    /**
     * Caches the time that server time delta was last retrieved
     * @param retrievalTime javascript date
     */
    this.setServerTimeRetrieved = function(retrievalTime)
    {
        localStorage[ KEY_SERVER_TIME_RETRIEVED ] = retrievalTime.getTime();
    }

    /**
     * Indicates whether there exists data values or complete data set
     * registrations in the local storage.
     *
     * @return true if local data exists, false otherwise.
     */
    this.hasLocalData = function()
    {
        var dataValues = this.getAllDataValues();
        var completeDataSets = this.getCompleteDataSets();

        if ( dataValues == null && completeDataSets == null )
        {
            return false;
        }
        else if ( dataValues != null )
        {
            if ( Object.keys( dataValues ).length < 1 )
            {
                return false;
            }
        }
        else if ( completeDataSets != null )
        {
            if ( Object.keys( completeDataSets ).length < 1 )
            {
                return false;
            }
        }

        return true;
    };
}

// -----------------------------------------------------------------------------
// Option set
// -----------------------------------------------------------------------------
// ToDo(plugin): what needs to be done for option sets
/**
 * Inserts the name of the option set in the input field with the given identifier.
 * The option set input fields should use the name as label and code as value to
 * be saved.
 * 
 * @fieldId the identifier of the field on the form #deuid-cocuid-val.
 * @value the value with properties id (deuid-cocuid) and val (option name).
 */
dhis2.de.setOptionNameInField = function( fieldId, value )
{
  var id = value.id;

  if(value.id.split("-").length == 3)
  {
    id = id.substr(12);
  }

	var optionSetUid = dhis2.de.optionSets[id].uid;

	DAO.store.get( 'optionSets', optionSetUid ).done( function( obj ) {
		if ( obj && obj.optionSet && obj.optionSet.options ) {			
			$.each( obj.optionSet.options, function( inx, option ) {
				if ( option && option.code == value.val ) {
			          option.id = option.code;
			          option.text = option.displayName;
			          $( fieldId ).select2('data', option);
			          return false;
				}
			} );
		}		
	} );
};

/**
 * Performs a search for options for the option set with the given identifier based
 * on the given query. If query is null, the first MAX options for the option set
 * is used. Checks and uses option set from local store, if not fetches option
 * set from server.
 */
dhis2.de.searchOptionSet = function( uid, query, success ) 
{
	var noneVal = '[No value]';
	
    if ( window.DAO !== undefined && window.DAO.store !== undefined ) {
        DAO.store.get( 'optionSets', uid ).done( function ( obj ) {
            if ( obj && obj.optionSet ) {
                var options = [];

                if ( query == null || query == '' || query == noneVal ) {
                    options = obj.optionSet.options.slice( 0, dhis2.de.cst.dropDownMaxItems - 1 );
                } 
                else {
                    query = query.toLowerCase();

                    for ( var idx=0, len = obj.optionSet.options.length; idx < len; idx++ ) {
                        var item = obj.optionSet.options[idx];

                        if ( options.length >= dhis2.de.cst.dropDownMaxItems ) {
                            break;
                        }

                        if ( item.name.toLowerCase().indexOf( query ) != -1 ) {
                            options.push( item );
                        }
                    }
                }
                
                if ( options && options.length > 0 ) {
                	options.push( { name: noneVal, code: '' } );
                }

                success( $.map( options, function ( item ) {
                    return {
                        label: item.displayName,
                        id: item.code
                    };
                } ) );
            }
            else {
                dhis2.de.getOptions( uid, query, success );
            }
        } );
    } 
    else {
        dhis2.de.getOptions( uid, query, success );
    }
};

/**
 * Retrieves options from server. Provides result as jquery ui structure to the
 * given jquery ui success callback.
 */
dhis2.de.getOptions = function( uid, query, success ) 
{
    var encodedQuery = encodeURIComponent(query);
    var encodedFields = encodeURIComponent(':all,options[:all]');
    var encodedUrl =
      "../api/optionSets/" +
      uid +
      ".json?fields=" +
      encodedFields +
      "&links=false&q=" +
      encodedQuery;
  
    return $.ajax( {
        url: encodedUrl,
        dataType: "json",
        cache: false,
        type: 'GET',
        success: function ( data ) {
            success( $.map( data.options, function ( item ) {
                return {
                    label: item.displayName,
                    id: item.code
                };
            } ) );
        }
    } );
};

/**
 * Loads option sets from server into local store.
 */
dhis2.de.loadOptionSets = function() 
{
    var options = _.uniq( _.values( dhis2.de.optionSets ), function( item ) {
        return item.uid;
    }); // Array of objects with uid and v

    var uids = [];

    var deferred = $.Deferred();
    var promise = deferred.promise();

    _.each( options, function ( item, idx ) {
        if ( uids.indexOf( item.uid ) == -1 ) {
            DAO.store.get( 'optionSets', item.uid ).done( function( obj ) {
                if( !obj || !obj.optionSet || !obj.optionSet.version || !item.v || obj.optionSet.version !== item.v ) {
                    promise = promise.then( function () {
                        var encodedFields = encodeURIComponent(':all,options[:all]');
                      
                        return $.ajax( {
                            url: '../api/optionSets/' + item.uid + '.json?fields=' + encodedFields,
                            type: 'GET',
                            cache: false
                        } ).then( function ( data ) {
                            console.log( 'Successfully stored optionSet: ' + item.uid );

                            var obj = {};
                            obj.id = item.uid;
                            obj.optionSet = data;
                            DAO.store.set( 'optionSets', obj );
                        }, function (error) {
                            console.warn( 'Failed to load optionSet: ' + item.uid, error);
                        } );
                    } );

                    uids.push( item.uid );
                }
            });
        }
    } );

    promise = promise.then( function () {
    } );

    deferred.resolve();
};

/**
 * Enable event for showing DataElement description when click on
 * a DataElement label
 */
dhis2.de.enableDEDescriptionEvent = function()
{
    // ToDo(plugin): see if we can hook this with the parent to show in the bottom bar
    
}

/**
 * Inserts option sets in the appropriate input fields.
 */
dhis2.de.insertOptionSets = function() 
{
    $( '.entryoptionset').each( function( idx, item ) {
        
        var fieldId = item.id;
        
        var split = dhis2.de.splitFieldId( fieldId );

        var dataElementId = split.dataElementId;
        var optionComboId = split.optionComboId;
        
    	var optionSetKey = dhis2.de.splitFieldId( item.id );
        var s2prefix = 's2id_';        
        optionSetKey.dataElementId = optionSetKey.dataElementId.indexOf(s2prefix) != -1 ? optionSetKey.dataElementId.substring(s2prefix.length, optionSetKey.dataElementId.length) : optionSetKey.dataElementId;
        
        if ( dhis2.de.multiOrganisationUnit ) {
        	item = optionSetKey.organisationUnitId + '-' + optionSetKey.dataElementId + '-' + optionSetKey.optionComboId;
        } 
        else {
        	item = optionSetKey.dataElementId + '-' + optionSetKey.optionComboId;
        }
        
        item = item + '-val';
        optionSetKey = optionSetKey.dataElementId + '-' + optionSetKey.optionComboId;
        var optionSetUid = dhis2.de.optionSets[optionSetKey].uid;
        
        DAO.store.get( 'optionSets', optionSetUid ).done( function( obj ) {
		if ( obj && obj.optionSet && obj.optionSet.options ) {

                    $.each( obj.optionSet.options, function( inx, option ) {
                        option.text = option.displayName;
                        option.id = option.code;
                    } );
                    
                    $("#" + item).select2({
                        placeholder: i18n_select_option ,
                        allowClear: true,
                        dataType: 'json',
                        data: obj.optionSet.options
                    }).on("change", function(e){
                        saveVal( dataElementId, optionComboId, fieldId );
                    });
		}		
	} );        
    } );
};

/**
 * Applies the autocomplete widget on the given input field using the option set
 * with the given identifier.
 */
dhis2.de.autocompleteOptionSetField = function( idField, optionSetUid ) 
{
    var input = jQuery( '#' + idField );

    if ( !input ) {
        return;
    }

    input.autocomplete( {
        delay: 0,
        minLength: 0,
        source: function ( request, response ) {
            dhis2.de.searchOptionSet( optionSetUid, input.val(), response );
        },
        select: function ( event, ui ) {
            input.val( ui.item.id );
            input.autocomplete( 'close' );
            input.change();
        },
        change: function( event, ui ) {
            if( ui.item == null ) {
                $( this ).val("");
                $( this ).focus();
            }
        }
    } ).addClass( 'ui-widget' );

    input.data( 'ui-autocomplete' )._renderItem = function ( ul, item ) {
        return $( '<li></li>' )
            .data( 'item.autocomplete', item )
            .append( '<a>' + item.label + '</a>' )
            .appendTo( ul );
    };

    var wrapper = this.wrapper = $( '<span style="width:200px">' )
        .addClass( 'ui-combobox' )
        .insertAfter( input );

    var button = $( '<a style="width:20px; margin-bottom:1px; height:20px;">' )
        .attr( 'tabIndex', -1 )
        .attr( 'title', i18n_show_all_items )
        .appendTo( wrapper )
        .button( {
            icons: {
                primary: 'ui-icon-triangle-1-s'
            },
            text: false
        } )
        .addClass( 'small-button' )
        .click( function () {
            if ( input.autocomplete( 'widget' ).is( ':visible' ) ) {
                input.autocomplete( 'close' );
                return;
            }
            $( this ).blur();
            input.autocomplete( 'search', '' );
            input.focus();
        } );
};

/*
 * get selected period - full object - with start and end dates
 */
dhis2.de.getSelectedPeriod = function()
{
    
    var periodId = dhis2.de.currentPeriodId // $( '#selectedPeriodId').val();
    
    var period = null;
    
    if( periodId && periodId != "" )
    {
        period = dhis2.de.periodChoices[ periodId ];        
    }
    
    return period;
}

/*
 * lock all input filed in data entry form
 */
// ToDO(plugin): test functionality
dhis2.de.lockForm = function()
{
    $( '#contentDiv input').attr( 'readonly', 'readonly' );
    $( '#contentDiv textarea').attr( 'readonly', 'readonly' );
    $( '.sectionFilter').removeAttr( 'disabled' );
    $( '#completenessDiv' ).hide();
    
    $( '#contentDiv input' ).css( 'backgroundColor', '#eee' );
    $( '.sectionFilter' ).css( 'backgroundColor', '#fff' );
}

/*
 * populate section row totals
 */
// ToDO(plugin): test functionality
dhis2.de.populateRowTotals = function(){
    
    if( !dhis2.de.multiOrganisationUnit )
    {
        $("input[id^='row-']").each(function(i, el){
            var ids = this.id.split('-');
            if( ids.length > 2 )
            {
                var de = ids[1], total = new Number();
                for( var i=2; i<ids.length; i++ )
                {
                    var val = $( '#' + de + "-" + ids[i] + "-val" ).val();
                    if( dhis2.validation.isNumber( val ) )
                    {                        
                        total += new Number( val );
                    }                    
                }
                $(this).val( total );
            }            
        });
    }
};

/*
 * populate section column totals
 */
// ToDO(plugin): test functionality
dhis2.de.populateColumnTotals = function(){
    
    if( !dhis2.de.multiOrganisationUnit )
    {
        $("input[id^='col-']").each(function(i, el){            
            
            var $tbody = $(this).closest('.sectionTable').find("tbody");
            var $trTarget = $tbody.find( 'tr');
            
            var ids = this.id.split('-');
            
            if( ids.length > 1 )
            {
                var total = new Number();
                for( var i=1; i<ids.length; i++ )
                {                    
                    $trTarget.each( function( idx, item ) 
                    {
                        var inputs = $( item ).find( '.entryfield' );                        
                        inputs.each( function(k, e){
                            if( this.id.indexOf( ids[i] ) !== -1 && $(this).is(':visible') )
                            {
                                var val = $( this ).val();
                                if( dhis2.validation.isNumber( val ) )
                                {                        
                                    total += new Number( val );
                                }
                            }
                        });
                    } );
                }                
                $(this).val( total );
            }            
        });
    }
};

// -----------------------------------------------------------------------------
// Various
// -----------------------------------------------------------------------------

// ToDO(plugin): test functionality
function getUserSetting()
{   
    if ( dhis2.de.isOffline && settings !== null ) {
        return;
    }

    var def = $.Deferred();

    var url = '../api/userSettings.json?key=keyAnalysisDisplayProperty';

    //Gets the user setting for whether it should display short names for org units or not.
    $.getJSON(url, function( data ) {
            console.log("User settings loaded: ", data);
            dhis2.de.storageManager.setUserSettings(data);
            def.resolve();
        }
    );

    return def;
}
// ToDO(plugin): test functionality
function getTimeDelta()
{
    if (dhis2.de.isOffline) {
        return;
    }

    var def = $.Deferred();

    var url = '../api/system/info';

    //Gets the server time delta
    $.getJSON(url, function( data ) {
            serverTimeDelta = new Date(data.serverDate.substring(0,24)) - new Date();
            dhis2.de.storageManager.setServerTimeDelta(serverTimeDelta);
            // if successful, record time of update
            dhis2.de.storageManager.setServerTimeRetrieved(new Date());
            console.log("stored server time delta of " + serverTimeDelta + " ms");
            def.resolve();
        }
    );

    return def;
}
