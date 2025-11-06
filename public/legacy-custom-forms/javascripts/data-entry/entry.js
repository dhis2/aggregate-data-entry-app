/**
 * This file depends on form.js.
 * 
 * Format for the span/input identifiers for selectors:
 * 
 * {dataelementid}-{optioncomboid}-val // data value 
 * {dataelementid}-dataelement name of data element 
 * {optioncomboid}-optioncombo // name of category option combo 
 * {dataelementid}-cell // table cell for data element name
 * {dataelementid}-{optioncomboid}-min // min value for data value
 * {dataelementid}-{optioncomboid}-max // max value for data value
 */

// -----------------------------------------------------------------------------
// Save
// -----------------------------------------------------------------------------

/**
 * Updates totals for data element total fields.
 * 
 * @param dataElementId the id of the data element to update total fields, if
 *        omitted then all total fields are updated.
 */
dhis2.de.updateDataElementTotals = function( dataElementId )
{
	var currentTotals = [];
	
	$( 'input[name="total"]' ).each( function( index )
	{
		var de = $( this ).attr( 'dataelementid' );
		
		if ( !dataElementId || dataElementId == de )
		{		
			var total = dhis2.de.getDataElementTotalValue( de );
			
			$( this ).val( total );
		}
	} );
}

/**
 * Updates all indicator input fields with the calculated value based on the
 * values in the input entry fields in the form.
 */
dhis2.de.updateIndicators = function()
{
    $( 'input[name="indicator"]' ).each( function( index )
    {
        var indicatorId = $( this ).attr( 'indicatorid' );

        var formula = dhis2.de.indicatorFormulas[indicatorId];

        if ( typeof formula !== 'undefined' )
        {        
	        var expression = dhis2.de.generateExpression( formula?.explodedNumerator);
            var denominator = dhis2.de.generateExpression(formula?.denominator)
            
	        if ( expression )
	        {
		        var value = eval( `(${expression}) / (${denominator})`);

		        value = isNaN( value ) ? '-' : Math.round( value, 1 );
		
		        $( this ).val( value );
	        }
        }
        else
        {
        	log( 'Indicator does not exist in form: ' + indicatorId );
        }
    } );
}

/**
 * Returns the total sum of values in the current form for the given data element
 * identifier.
 */
dhis2.de.getDataElementTotalValue = function( de )
{
    var sum = new Number();
		
	$( '[id^="' + de + '"]' ).each( function( index )
	{
	    var val = $( this ).val();
		
		if ( val && dhis2.validation.isNumber( val ) )
		{
			sum += new Number( $( this ).val() );
		}
	} );
	
	return sum;
}

/**
 * Returns the value in the current form for the given data element and category
 * option combo identifiers. Returns 0 if the field does not exist in the form.
 */
dhis2.de.getFieldValue = function( de, coc )
{
    var fieldId = '#' + de + '-' + coc + '-val';

    var value = '0';
    
    if ( $( fieldId ).length )
    {
        value = $( fieldId ).val() ? $( fieldId ).val() : '0';

    }
    
    return value;
}

/**
 * Parses the expression and substitutes the operand identifiers with the value
 * of the corresponding input entry field.
 */
dhis2.de.generateExpression = function( expression )
{
    var matcher = expression.match( dhis2.de.cst.formulaPattern );

    for ( k in matcher )
    {
        var match = matcher[k];

        // Remove brackets from expression to simplify extraction of identifiers

        var operand = match.replace( /[#\{\}]/g, '' );

        var isTotal = !!( operand.indexOf( dhis2.de.cst.separator ) == -1 );
        
        var value = '0';
        
        if ( isTotal )
        {
        	value = dhis2.de.getDataElementTotalValue( operand );
        }
        else
        {
	        var de = operand.substring( 0, operand.indexOf( dhis2.de.cst.separator ) );
	        var coc = operand.substring( operand.indexOf( dhis2.de.cst.separator ) + 1, operand.length );	
	        value = dhis2.de.getFieldValue( de, coc );
        }

        expression = expression.replace( match, value );
        
        // TODO signed numbers
    }

    return expression;
}

function saveVal( dataElementId, optionComboId, fieldId, feedbackId )
{
    var fieldIds = fieldId.split( "-" );

    feedbackId = '#' + ( feedbackId || fieldId );

    if ( fieldIds.length > 3 )
    {
      dhis2.de.currentOrganisationUnitId = fieldIds[0];
    }

    fieldId = '#' + fieldId;

    var type = getDataElementType( dataElementId );

    var value;

    if( type === 'DATETIME' )
    {
        var date = $( '#' + dataElementId + '-' + optionComboId + '-val-dp').val();
        var time = $( '#' + dataElementId + '-' + optionComboId + '-time').val();
        if ( date )
        {
          value = date + 'T' + ( time  ? time :  '00:00');
        }
        else
        {
          return;
        }
    }
    else
    {
        value = $(fieldId).val();
    }

    $( feedbackId ).wrap( $('<div style="border: 0px solid red; position: relative" class="field-wrapper"></div>' ));

    $( feedbackId ).parent('.field-wrapper').prepend('<div class="updating" style="position: absolute;inset-block-start: 0;inset-inline-end: 0;"><svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg" color="#4a5768"><path d="M3 7a1 1 0 110 2 1 1 0 010-2zm5 0a1 1 0 110 2 1 1 0 010-2zm5 0a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" fill-rule="evenodd"></path></svg></div>')
    var periodId = $( '#selectedPeriodId' ).val();

    var dataSetId = $( '#selectedDataSetId' ).val();

    var valueSaver = new ValueSaver( dataElementId, periodId, optionComboId, dataSetId, value, feedbackId, dhis2.de.cst.colorGreen );
    valueSaver.save();

    dhis2.de.populateRowTotals();
    dhis2.de.populateColumnTotals();
    dhis2.de.updateIndicators(); // Update indicators for custom form
    dhis2.de.updateDataElementTotals( dataElementId ); // Update data element totals for custom forms
}

function saveBoolean( dataElementId, optionComboId, _fieldId )
{
    var fieldId = '#' + _fieldId;
    
    var value = $('input[id=' + _fieldId + ']:checked').val();

    if ( value === undefined )
    {
        value = ""; // save no_value
    }

    $( fieldId ).css( 'background-color', dhis2.de.cst.colorYellow );

    var periodId = $( '#selectedPeriodId' ).val();

    var dataSetId = $( '#selectedDataSetId' ).val();

    var valueSaver = new ValueSaver( dataElementId, periodId, optionComboId, dataSetId, value, fieldId, dhis2.de.cst.colorGreen );
    valueSaver.save();
}

function saveTrueOnly( dataElementId, optionComboId, fieldId )
{
    fieldId = '#' + fieldId;

    var value = $( fieldId ).is( ':checked' );
    
    value = ( value == true) ? value : undefined; // Send nothing if un-ticked

    $( fieldId ).css( 'background-color', dhis2.de.cst.colorYellow );

    var periodId = $( '#selectedPeriodId' ).val();

    var dataSetId = $( '#selectedDataSetId' ).val();

    var valueSaver = new ValueSaver( dataElementId, periodId, optionComboId, dataSetId, value, fieldId, dhis2.de.cst.colorGreen );
    valueSaver.save();
}

/**
 * Supportive method.
 */
dhis2.de.alertField = function( fieldId, alertMessage )
{
    var $field = $( fieldId );
    $field.css( 'background-color', dhis2.de.cst.colorYellow );
    dhis2.shim.showAlert( alertMessage );
    
    var val = dhis2.de.currentExistingValue || '';
    $field.val( val );
    
    $field.focus();

    return false;
}

// -----------------------------------------------------------------------------
// Saver objects
// -----------------------------------------------------------------------------

/**
 * @param de data element identifier.
 * @param pe iso period.
 * @param co category option combo.
 * @param ds data set identifier.
 * @param value value.
 * @param fieldId identifier of data input field.
 * @param resultColor the color code to set on input field for success.
 */
function ValueSaver( de, pe, co, ds, value, fieldId, resultColor )
{
	var ou = dhis2.de.getCurrentOrganisationUnit();
	
    var dataValue = {
        'de' : de,
        'co' : co,
        'ds' : ds,
        'ou' : ou,
        'pe' : pe,
        'value' : value,
        deId: de,
        cocId: co
    };

    var cc = dhis2.de.getCurrentCategoryCombo();
    var cp = dhis2.de.getCurrentCategoryOptionsQueryValue();
    
    if ( cc && cp )
    {
    	dataValue.cc = cc;
    	dataValue.cp = cp;
    }
    
    this.save = function()
    {
        window.dhis2.shim.saveValue(dataValue, { 
            onSuccess: () => {
                // need to wrap fieldId here to keep it linked to the onSuccess of this field
                // otherwise if we pass it to parent, and then back, it gets lost in memoising hell in the useDataMutation hook
                handleSuccess(fieldId)
            }, 
            onError: (e) => {
                $(fieldId ).parent().find('.updating').remove()
                markValue(fieldId, dhis2.de.cst.colorYellow );
                window.dhis2.shim.showAlert(e)
            }
        })
    };

    var afterHandleSuccess = function() {};

    this.setAfterHandleSuccess = function( callback ) {
        afterHandleSuccess = callback;
    };

    function handleSuccess(_fieldId)
    {
        markValue( _fieldId, resultColor );
        // console.log($( fieldId ))
        $( _fieldId ).parent().find('.updating').remove()
        afterHandleSuccess();
    }

    function markValue( fieldId, color )
    {
        $( fieldId ).css( 'background-color', color );
    }
}
