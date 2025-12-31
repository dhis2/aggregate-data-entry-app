
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


dhis2.de.getCurrentOrganisationUnit = function() 
{    
    return dhis2.de.currentOrganisationUnitId;
};

( function( $ ) {
    $.safeEach = function( arr, fn ) 
    {
        if ( arr )
        {
            $.each( arr, fn );
        }
    };
} )( jQuery );


dhis2.de.manageOfflineData = function()
{
    warnDeprecate('dhis2.de.manageOfflineData', 'managing offline data is handled by the parent app')
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

dhis2.de.setMetaDataLoaded = function()
{
    warnDeprecate('dhis2.de.setMetaDataLoaded', 'metadata is passed to the plugin on mount rather than being loaded')
};

dhis2.de.discardLocalData = function() {
    warnDeprecate('dhis2.de.discardLocalData', 'managing offline data is handled by the parent app')
};

dhis2.de.uploadLocalData = function()
{
    warnDeprecate('dhis2.de.uploadLocalData', 'managing offline data is handled by the parent app')
};

// ToDO(custom-forms): go through these event listeners
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

        var type = getDataElementType( dataElementId )?.valueType;

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

        $( this ).keyup( function( event )
        {
            keyPress( event, this );
        } );

        if ( ( type === 'DATE' || type === 'DATETIME' ) && !isTimeField )
        {
            $(this).attr('type', 'date')
            
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

    $( '.commentlink' ).remove();
    
    var periodId = $( '#selectedPeriodId' ).val();
    var dataSetId = $( '#selectedDataSetId' ).val();

    $( '.entryfileresource' ).off( 'change' );

    $( '.entryfileresource' ).each( function()
    {
        var id = $( this ).attr( 'id' );
        var split = dhis2.de.splitFieldId( id );
        
        const dvParams = {
            'de' : split.dataElementId,
            'co' : split.optionComboId,
            deId: split.dataElementId,
            cocId: split.optionComboId,
            'ds' : dataSetId,
            'ou' : split.organisationUnitId,
            'pe' : periodId,
        };

        const $field = $(this)
        $field.find(".upload-button")
        .text('×')
        .attr('title', 'Delete file')
        .on('click', (ev) => {
            window.dhis2.shim.fileHelper.deleteFile(dvParams, {
                onSuccess: () => {
                    window.dhis2.shim.showAlert({message: 'File deleted successfully'})
                    $field.find('input[type="file"]').show().val('')
                    $field.find('.upload-field').hide()
                    $field.find('.upload-button-group').hide()
                }
            })
        })
        
        $field.find('input[type="file"]').show()
        // ! remove old HTML prepared by the API as it is no longer relevant 
        $field.find('.entryfileresource-input').remove()
        $field.find('.upload-field').hide()
        $field.find('.upload-button-group').hide()
        
        $field.find("input[type='file']").on('change', async (ev)  =>{
            ev.preventDefault()
            const file = ev.target.files?.[0]
            const reader = new FileReader();
            if(file instanceof File) {
                reader.readAsDataURL(file);
                
                reader.addEventListener("load", () => {
                    window.dhis2.shim.fileHelper.uploadFile(reader.result, {
                        fileName: file.name,
                        dataValueParams: dvParams,
                        onSuccess: () => {
                            $field.find('input[type="file"]').hide()
                            $field.find('.upload-field').show()
                            $field.find('.upload-button-group').show()
                            var $filename = $field.find( '.upload-fileinfo-name' );
                            $filename.html('')
                            $( '<a>', {
                                text: file.name,
                                title: file.name,
                                target: '_blank',
                                href: window.DHIS2_BASE_URL + "api/dataValues/files?" + $.param( dvParams )
                            } ).appendTo( $filename );

                            $field.find( '.upload-fileinfo-size' ).text( file.size );
                        }
                    })
                });
                
            }
        })
    } );
}

dhis2.de.resetSectionFilters = function()
{
    warnDeprecate('dhis2.de.resetSectionFilters')
}

dhis2.de.clearSectionFilters = function()
{
    warnDeprecate('dhis2.de.clearSectionFilters')
}

dhis2.de.clearPeriod = function()
{
    warnDeprecate('dhis2.de.clearPeriod')
}

/**
 * @deprecated
 */
dhis2.de.clearEntryForm = function()
{
    warnDeprecate('dhis2.de.clearEntryForm')
}

/**
 * ![custom-forms] This is the starting method being called from the plugin
 */
dhis2.de.loadForm = function()
{
    var dataSetId = dhis2.de.currentDataSetId;
    console.log(`[custom-forms] dhis2.de.loadForm - dataSetId: "${dataSetId}"`)
	
    $( "#tabs" ).tabs({
        activate: function(){
            //populate section row/column totals
            dhis2.de.populateRowTotals();
            dhis2.de.populateColumnTotals();
        }
    });

	// dhis2.de.currentOrganisationUnitId = selection.getSelected()[0];
    console.log('[custom-forms] dhis2.de.currentOrganisationUnitId', dhis2.de.currentOrganisationUnitId)
    console.log('[custom-forms] dhis2.de.currentDataSetId', dhis2.de.currentDataSetId)
    $( document ).trigger( dhis2.de.event.formLoaded, dhis2.de.currentDataSetId );

    dataSetSelected();
    var table = $( '.sectionTable' );
    table.floatThead({
        position: 'absolute',
        top: 44,
        zIndex: 9
    });
    dhis2.de.insertOptionSets();
    loadDataValues();

    // ToDo(custom-forms) re-check the scope of the original loadForm and see if functionality missing
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

    split.organisationUnitId = dhis2.de.getCurrentOrganisationUnit();
    split.dataElementId = id.split( '-' )[0];
    split.optionComboId = id.split( '-' )[1];

    return split;
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

    // ToDo(plugin): test "allow future periods"
    
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
    warnDeprecate('dhis2.de.clearAttributes')
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
    getAndInsertDataValues();
    displayEntryFormCompleted();
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

    $( '[name="min"]' ).html( '' );
    $( '[name="max"]' ).html( '' );

    $( '.entryfield' ).filter( ':disabled' ).css( 'background-color', dhis2.de.cst.colorGrey );

    var params = {
		pe : periodId,
        ds : dataSetId,
        // dataElementId: dataElementId,
        ou : dhis2.de.getCurrentOrganisationUnit(),
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
	    error: function(err) // offline
	    {
            console.error(err)
            // ToDo(custom-forms): what do we do on error - we can use a similar approach to saving and use parent method to load data values (then it might work offline too)
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

function insertDataValues( json )
{
    var dataValueMap = []; // Reset
    dhis2.de.currentMinMaxValueMap = []; // Reset
    
    var period = dhis2.de.getSelectedPeriod();
    
    var dataSet = dhis2.de.dataSets[dhis2.de.currentDataSetId];
    
    var periodLocked = false;
    
    if ( dataSet && dataSet.expiryDays > 0 )
    {
        // ToDO(custom-forms): do we need an equivalent of this server time delta logic?
        var serverTimeDelta = dhis2.de?.storageManager?.getServerTimeDelta?.() || 0;
        var maxDate = moment( period.endDate, dhis2.period.format.toUpperCase() ).add( parseInt(dataSet.expiryDays), 'day' );
        periodLocked = moment().add( serverTimeDelta, 'ms' ).isAfter( maxDate );
    }

    // var lockExceptionId = dhis2.de.currentOrganisationUnitId + "-" + dhis2.de.currentDataSetId + "-" + period.iso;

    // periodLocked = periodLocked && dhis2.de.lockExceptions.indexOf( lockExceptionId ) == -1;

    // if ( json.locked !== 'OPEN' || dhis2.de.blackListedPeriods.indexOf( period.iso ) > -1 || periodLocked )
	// {
		// dhis2.de.lockForm();

	// 	if ( periodLocked ) {
	// 		setHeaderDelayMessage( dhis2.shim.i18n_translations.i18n_dataset_is_concluded );
	// 	} else if ( dhis2.de.blackListedPeriods.indexOf( period.iso ) > -1 ) {
	// 		setHeaderDelayMessage( dhis2.shim.i18n_translations.i18n_dataset_is_closed );
	// 	} else if ( json.locked === 'APPROVED' ) {
	// 		setHeaderDelayMessage( dhis2.shim.i18n_translations.i18n_dataset_is_approved );
	// 	} else {
	// 		setHeaderDelayMessage( dhis2.shim.i18n_translations.i18n_dataset_is_locked );
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
    if ( period )
    {    
        if ( dhis2.de.validateOrgUnitOpening( organisationUnits[dhis2.de.getCurrentOrganisationUnit()], period ) )
        {
            dhis2.de.lockForm();
        setHeaderDelayMessage( dhis2.shim.i18n_translations.i18n_orgunit_is_closed);
            return;
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
                var split = dhis2.de.splitFieldId( $field.attr( 'id' ) );
                
                var dvParams = {
                    'de': split.dataElementId,
                    'co': split.optionComboId,
                    'ou': split.organisationUnitId,
                    'pe': $( '#selectedPeriodId' ).val(),
                    'ds': $( '#selectedDataSetId' ).val()
                };
                
                if  ( !valueToShow ) {
                    $field.find('input[type="file"]').show()
                    $field.find('.upload-field').hide()
                    $field.find('.upload-button-group').hide()
                } else {
                    $field.find('input[type="file"]').hide()
                    $field.find('.upload-field').show()
                    $field.find('.upload-button-group').show()
                    
                    dhis2.shim.fileHelper.loadFileMetadata(valueToShow).then((data) => {

                        $field.find( 'input[class="entryfileresource-input"]' ).val( valueToShow );

                        

                        var cc = dhis2.de.getCurrentCategoryCombo();
                        var cp = dhis2.de.getCurrentCategoryOptionsQueryValue();

                        if( cc && cp )
                        {
                            dvParams.cc = cc;
                            dvParams.cp = cp;
                        }

                        var name = "", size = "";

                        if ( data.name )
                        {
                            name = data.name;
                            size = '(' + ( data.contentLength ) + ')';
                        }
                        else
                        {
                            name = dhis2.shim.i18n_translations.i18n_loading_file_info_failed
                        }

                        var $filename = $field.find( '.upload-fileinfo-name' );

                        $( '<a>', {
                            text: name,
                            title: name,
                            target: '_blank',
                            href: window.DHIS2_BASE_URL + "api/dataValues/files?" + $.param( dvParams )
                        } ).appendTo( $filename );

                        $field.find( '.upload-fileinfo-size' ).text( size );
                    })
                }

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

        // ToDO(custom-forms): what is this???? do we need to do something special for pickers?
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

    if (dataElementId) {
        window.dhis2.shim.setHighlightedField({
            dataElementId: split.dataElementId,
            categoryOptionComboId: split.optionComboId,
        })
    }
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
    const { ctrlKey, metaKey } = event
    const key = event.keyCode || event.charCode || event.which;

    const ctrlXorMetaKey = ctrlKey ^ metaKey

    if (ctrlXorMetaKey && event.key === 'Enter') {
        window.dhis2.shim.showDetailsBar()
        return
    } 
    

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
// Option set
// -----------------------------------------------------------------------------
// ToDo(custom-forms): what needs to be done for option sets? searching, autocompleting etc...
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
    var dataElement = dhis2.de.dataElements[value.dataElement]
    var optionSetId = dataElement.optionSet.id
    var optionSet = dhis2.de.optionSets[optionSetId]

    
    if ( optionSet?.options?.length ) {			
        $.each( optionSet?.options, function( inx, option ) {
            if ( option && option.code == value.value ) {
                    option.id = option.code;
                    option.text = option.displayName;
                    $( fieldId ).select2('data', option);
                    return false;
            }
        } );
    }		
};

/**
 * Performs a search for options for the option set with the given identifier based
 * on the given query. If query is null, the first MAX options for the option set
 * is used. Checks and uses option set from local store, if not fetches option
 * set from server.
 */
dhis2.de.searchOptionSet = function( uid, query, success ) 
{	
    dhis2.de.getOptions( uid, query, success );
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
 * @deprecated This method used to load optionSets from API and save them to cache, now all the option sets are passed from the parent at load time.
 */
dhis2.de.loadOptionSets = function() 
{
    warnDeprecate('dhis2.de.loadOptionSets')
};

/**
 * Enable event for showing DataElement description when click on
 * a DataElement label
 * 
 * @deprecated In the plugin, we have different way of highlighting a field and showing its details in the bottom bar
 */
dhis2.de.enableDEDescriptionEvent = function()
{
    warnDeprecate('dhis2.de.enableDEDescriptionEvent')
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

        const optionSetsForDataElement = dhis2.de.dataElements[dataElementId].optionSet?.id

        const optionSet =  dhis2.de.optionSets[optionSetsForDataElement]

        const elementId = dataElementId + '-' + optionComboId + '-val';

        $.each( optionSet.options, function( inx, option ) {
            option.text = option.displayName;
            option.id = option.code;
        } );
        
        $("#" + elementId).select2({
            placeholder: dhis2.shim.i18n_translations.i18n_select_option,
            allowClear: true,
            dataType: 'json',
            data: optionSet.options,
        }).on("change", function(e){
            saveVal( dataElementId, optionComboId, fieldId );
        }).on('select2-focus', function () {
            window.dhis2.shim.setHighlightedField({
                dataElementId: dataElementId,
                categoryOptionComboId: optionComboId,
            })
        });      
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
        .attr( 'title', dhis2.shim.i18n_translations.i18n_show_all_items )
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

/**
 * lock all input filed in data entry form
 * 
 * @deprecated
 */
dhis2.de.lockForm = function()
{
    warnDeprecate('dhis2.de.lockForm')
}

/*
 * populate section row totals
 */
// ToDO(custom-forms): test functionality for populating totals
dhis2.de.populateRowTotals = function(){
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
};

/*
 * populate section column totals
 */
// ToDO(custom-forms): test functionality for populating totals
dhis2.de.populateColumnTotals = function(){    
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
};

// -----------------------------------------------------------------------------
// Various
// -----------------------------------------------------------------------------

function getUserSetting()
{   
    warnDeprecate('getUserSetting')
}

function getTimeDelta()
{
    warnDeprecate('getTimeDelta')
}
