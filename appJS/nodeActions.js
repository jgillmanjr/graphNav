/**
 * Node Editing Code
 * Jason Gillman Jr. <jason@rrfaae.com>
 */

/**
 *
 * Node Adding / Editing Related Functions
 *
 */

function addNodeProperty()
{
	$('#nodeProps').append('<span class="nodeProperty" id="prop">Name:<input type="text" class="propertyLabel" /> Value:<input type="text" class="propertyValue" id="propValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
}

function clearNodePopup()
{
	$('#nodePopup').hide();
	$('.nodeProperty').remove();
}

function createNode()
{
	// Get the properties
	var nodeProperties = new Object()
	$('.nodeProperty').each(
		function()
		{
			pLabel = $(this).find('.propertyLabel').val();
			pValue = $(this).find('.propertyValue').val();
			nodeProperties[pLabel] = pValue;
		}
	);
	
	// Create the node in Neo4j
	$.ajax('neo4jProxy.php?action=addNode',
		{
			type: 'POST',
			async: true,
			dataType:	'json',
			data:
				{
					nodeProperties: JSON.stringify(nodeProperties)
				},
			success:
				function(returnData, textStatus, jqXHR)
				{
					data.nodes.add(returnData);
				}
		}
	);

	clearNodePopup();
}

function newNode()
{
	$('#nodePopup').show();
	$('#nodeOperation').text('Create New Node');
	$('#nodeId').hide();
	$('#nodeProps').append('<span class="nodeProperty" id="prop">Name:<input type="text" class="propertyLabel" /> Value:<input type="text" class="propertyValue" id="propValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
}

/**
 *
 * End Node Related Functions
 *
 */
