/**
 * Action Code
 * Jason Gillman Jr. <jason@rrfaae.com>
 */

/**
 *
 * Node Related Functions
 *
 */

function clearNodePopup()
{
	$('#nodePopup').dialog("destroy");
	$('#nodePopup').empty();
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
	var nodePopDialog = $('#nodePopup').dialog(
		{
			dialogClass: "no-close",
			height: 300,
			width: 600,
			title: "Create New Node",
			buttons:
			[
				{
					text: "Add Property",
					click: function()
						{
							$(nodePopDialog).append('<span class="nodeProperty" id="prop">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" id="propValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
						}
				},
				{
					text: "Save",
					click: function()
						{
							createNode();
						}
				},
				{
					text: "Cancel",
					click: function()
						{
							clearNodePopup();
						}
				}
			]
		}
	);

	$(nodePopDialog).append('<span id="nodePropsHeader">Node Properties</span><br />')
	$(nodePopDialog).append('<span class="nodeProperty" id="prop">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" id="propValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
}

/**
 *
 * End Node Related Functions
 *
 */

/**
 *
 * Relation Related Functions
 *
 */

function clearRelationPopup()
{
	$('#relationPopup').dialog("destroy");
	$('#relationPopup').empty();
}

function createRelation(workingData)
{
	// Create the relation in Neo4j
	$.ajax('neo4jProxy.php?action=addRelation',
		{
			type: 'POST',
			async: true,
			dataType:	'json',
			data:
				{
					relationData: JSON.stringify(workingData)
				},
			success:
				function(returnData, textStatus, jqXHR)
				{
					data.edges.add(returnData);
				}
		}
	);

	clearRelationPopup();
}

function newRelation(workingData)
{
	var relationPopDialog = $('#relationPopup').dialog(
		{
			dialogClass: "no-close",
			height: 300,
			width: 600,
			title: "Create New Relation",
			buttons:
			[
				{
					text: "Add Property",
					click: function()
						{
							$(relationPopDialog).append('<span class="relationProperty" id="prop">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" id="propValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
						}
				},
				{
					text: "Save",
					click: function()
						{
							workingData.type = $('#relationTypeField').val();

							// Get the properties
							var relProperties = new Object()
							$('.relationProperty').each(
								function()
								{
									pLabel = $(this).find('.propertyLabel').val();
									pValue = $(this).find('.propertyValue').val();
									relProperties[pLabel] = pValue;
								}
							);

							workingData.properties = relProperties;

							createRelation(workingData);
						}
				},
				{
					text: "Cancel",
					click: function()
						{
							clearRelationPopup();
						}
				}
			]
		}
	);

	$(relationPopDialog).append('<span>Making relation from node ID ' + workingData.from + ' to node ID ' + workingData.to + '</span><br /><br />');
	$(relationPopDialog).append('<span id="relationType">Relation Type: <input type="text" id="relationTypeField" /></span><br /><br />');
	$(relationPopDialog).append('<span id="relationPropsHeader">Relation Properties</span><br />')
	$(relationPopDialog).append('<span class="relationProperty" id="prop">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" id="propValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
}

/**
 *
 * End Relation Related Functions
 *
 */
