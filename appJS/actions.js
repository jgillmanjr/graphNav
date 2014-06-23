/**
 * Action Code
 * Jason Gillman Jr. <jason@rrfaae.com>
 */

 /**
 *
 * Miscellanious Functions
 *
 */

function refreshGraph()
{
	data.edges.clear();
	data.nodes.clear();

	$.ajax('neo4jProxy.php?action=retrieveAll',
		{
			type: 'GET',
			async: false,
			dataType:	'json',
			success:
				function(returnData, textStatus, jqXHR)
				{
					data.nodes.add(returnData.nodes);
					data.edges.add(returnData.edges);
				}
		}
	);

	graph.redraw();
}

function htmlspecialchars(str)
{
	if(typeof(str) == "string")
	{
		str = str.replace(/&/g, "&amp;"); /* must do &amp; first */
		str = str.replace(/"/g, "&quot;");
		str = str.replace(/'/g, "&#039;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
	}
	return str;
}

 /**
  *
  * End Miscellanious Functions
  *
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

function deleteNodes(nodeIds)
{
	// Delete the relation from Neo4j
	$.ajax('neo4jProxy.php?action=deleteNodes',
		{
			type: 'POST',
			async: true,
			dataType:	'json',
			data:
				{
					nodeIds: JSON.stringify(nodeIds)
				},
			success:
				function(returnData, textStatus, jqXHR)
				{
					data.nodes.remove(returnData);
				}
		}
	);
}

function nodeAction(action, nodeId, callback)
{
	var title;
	var clickFunc;
	if(action == 'new') // New node being created
	{
		title = 'Create New Node';
		clickFunc = function(){data.nodes.add(nodeToNeo4j());};
	}
	else // Editing existing node
	{
		var freshData = new Object();
		// Load data from Neo4j in the off chance that existing data is stale
		$.ajax('neo4jProxy.php?action=loadNode',
			{
				type: 'POST',
				async: false,
				dataType:	'json',
				data:
					{
						nodeId: nodeId
					},
				success:
					function(returnData, textStatus, jqXHR)
					{
						freshData = returnData;
					}
			}
		);

		title = 'Editing Node: ' + freshData.id;

		clickFunc = function(){callback(nodeToNeo4j(freshData.id));};
	}

	/**
	 * Start common popup stuff
	 */
	var nodePopDialog = $('#nodePopup').dialog(
		{
			dialogClass: "no-close",
			height: 300,
			width: 600,
			title: title,
			buttons:
			[
				{
					text: "Add Label",
					click: function()
						{
							$('#nodePropsHeader').before('<span class="nodeLabel"><input type="text" class="labelValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>'); // So it goes before the property header
						}
				},
				{
					text: "Add Property",
					click: function()
						{
							$('#propertyTable').append('<tr class="nodeProperty"><td><input type="text" class="propertyLabel" /></td> <td><input type="text" class="propertyValue" /></td><td><input type="checkbox" class="propertyType" /></td><td><input type="button" value="-" onclick="$(this).parent().parent().remove();" /></td></tr>');
						}
				},
				{
					text: "Save",
					click: function()
						{
							clickFunc();
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

	$(nodePopDialog).append('<span id="nodeLabelHeader">Node Labels</span><br />');

	/**
	 * Labels
	 */
	if(action != 'new') // Node editing
	{
		if(freshData.neo4jLabels != null) // Null check
		{
			for(i = 0; i <= (freshData.neo4jLabels.length - 1); ++i)
			{
				$(nodePopDialog).append('<span class="nodeLabel"><input type="text" class="labelValue" value="' + htmlspecialchars(freshData.neo4jLabels[i]) + '" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
			}
		}
	}

	$(nodePopDialog).append('<span class="nodeLabel"><input type="text" class="labelValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');


	/**
	 * Properties
	 */
	$(nodePopDialog).append('<span id="nodePropsHeader">Node Properties</span><br />');
	$(nodePopDialog).append('<table id="propertyTable"><tr><th>Property Name</th><th>Property Value</th><th>Number</th><th>Remove Property</th></tr>')

	if(action != 'new') // Node editing
	{
		if(Object.keys(freshData.properties).length > 0)
		{
			for(i = 0; i <= (Object.keys(freshData.properties).length - 1); ++i)
			{
				var pName = Object.keys(freshData.properties)[i];
				var pValue = freshData.properties[pName];
				if(typeof(pValue) == "number") // Determine if a number or string, and subsequently set the number box as checked or not.
				{
					isNum = "checked";
				}
				else
				{
					isNum = "";
				}
				$('#propertyTable').append('<tr class="nodeProperty"><td><input type="text" class="propertyLabel" value="' + htmlspecialchars(pName) + '" /></td> <td><input type="text" class="propertyValue" value="' + htmlspecialchars(pValue) + '" /></td> <td><input type="checkbox" class="propertyType" ' + isNum + ' /></td> <td><input type="button" value="-" onclick="$(this).parent().parent().remove();" /></td></tr>');
			}
		}
	}

	$('#propertyTable').append('<tr class="nodeProperty"><td><input type="text" class="propertyLabel" /></td> <td><input type="text" class="propertyValue" /></td> <td><input type="checkbox" class="propertyType" /></td> <td><input type="button" value="-" onclick="$(this).parent().parent().remove();" /></td></tr>');
	$('#propertyTable').append('</table>')
}

function nodeToNeo4j(nodeId)
{
	var updatedData = new Object();

	// Get the properties
	var nodeProperties = new Object()
	$('.nodeProperty').each(
		function()
		{
			pLabel = $(this).find('.propertyLabel').val();
			pValue = $(this).find('.propertyValue').val();
			isNum = $(this).find('.propertyType').is(':checked');

			if(pLabel != "" & pValue != "") // If either are empty, don't add them
			{
				if(isNum & !isNaN(parseFloat(pValue))) // If it's a number..
				{
					nodeProperties[pLabel] = parseFloat(pValue);
				}
				else // Store it as a string
				{
					nodeProperties[pLabel] = pValue;
				}
			}
		}
	);

	// Get the labels
	var nodeLabels = new Array();
	$('.nodeLabel').each(
		function()
		{
			var workLabel = $(this).find('.labelValue').val()
			if(workLabel != "") // Stuff breaks if you pass in a null label to the neo4j library
			{
				nodeLabels.push(workLabel);
			}
		}
	);

	if(nodeId !== undefined) // Update an existing node
	{
		$.ajax('neo4jProxy.php?action=updateNode',
			{
				type: 'POST',
				async: false,
				dataType:	'json',
				data:
					{
						nodeId:	nodeId,
						nodeProperties: JSON.stringify(nodeProperties),
						nodeLabels:		JSON.stringify(nodeLabels)
					},
				success:
					function(returnData, textStatus, jqXHR)
					{
						updatedData = returnData;
					}
			}
		);
	}
	else // Brand new node
	{
		$.ajax('neo4jProxy.php?action=addNode',
			{
				type: 'POST',
				async: false,
				dataType:	'json',
				data:
					{
						nodeProperties: JSON.stringify(nodeProperties),
						nodeLabels:		JSON.stringify(nodeLabels)
					},
				success:
					function(returnData, textStatus, jqXHR)
					{
						//data.nodes.add(returnData);
						updatedData = returnData;
					}
			}
		);
	}

	clearNodePopup();
	return updatedData;
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

function deleteRelations(relationIds)
{
	// Delete the relation from Neo4j
	$.ajax('neo4jProxy.php?action=deleteRelations',
		{
			type: 'POST',
			async: true,
			dataType:	'json',
			data:
				{
					relationIds: JSON.stringify(relationIds)
				},
			success:
				function(returnData, textStatus, jqXHR)
				{
					data.edges.remove(returnData);
				}
		}
	);
}

function relationAction(action, workingData, relationId, callback)
{
	var title;
	var clickFunc;
	if(action == 'new') // New Relation
	{
		title = 'Create New Relation';
		clickFunc = function(){
			workingData.type = $('#relationTypeField').val();
			if(workingData.type == "")
			{
				alert("You must specify a relation type.");
			}
			else
			{
				data.edges.add(relationToNeo4j(workingData));
			}
		};
	}
	else // Edit Relation
	{
		var freshData = new Object();
		// Load data from Neo4j in the off chance that existing data is stale
		$.ajax('neo4jProxy.php?action=loadRelation',
			{
				type: 'POST',
				async: false,
				dataType:	'json',
				data:
					{
						relationId: relationId
					},
				success:
					function(returnData, textStatus, jqXHR)
					{
						freshData = returnData;
					}
			}
		);

		title = 'Editing Relation: ' + freshData.id;

		clickFunc = function()
		{
			callback(relationToNeo4j(workingData, freshData.id));
		}
	}

	// Common Stuff
	var relationPopDialog = $('#relationPopup').dialog(
		{
			dialogClass: "no-close",
			height: 300,
			width: 600,
			title: title,
			buttons:
			[
				{
					text: "Add Property",
					click: function()
						{
							$('#propertyTable').append('<tr class="relationProperty"><td><input type="text" class="propertyLabel" /></td> <td><input type="text" class="propertyValue" /></td> <td><input type="checkbox" class="propertyType" /></td> <td><input type="button" value="-" onclick="$(this).parent().parent().remove();" /></td></tr>');
						}
				},
				{
					text: "Save",
					click: function()
						{
							clickFunc();
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
	
	if(action == 'new')
	{
		$(relationPopDialog).append('<span>Making relation from node ID ' + workingData.from + ' to node ID ' + workingData.to + '</span><br /><br />');
	}

	if(action == 'new')
	{
		$(relationPopDialog).append('<span id="relationType">Relation Type: <input type="text" id="relationTypeField" /></span><br /><br />');
	}
	else
	{
		$(relationPopDialog).append('<span id="relationType">Relation Type: ' + htmlspecialchars(freshData.label) + '</span><br /><br />');
	}

	$(relationPopDialog).append('<span id="relationPropsHeader">Relation Properties</span><br />');
	$(relationPopDialog).append('<table id="propertyTable"><tr><th>Property Name</th><th>Property Value</th><th>Number</th><th>Remove Property</th></tr>');

	if(action != 'new') // Relation editing
	{
		if(Object.keys(freshData.properties).length > 0)
		{
			for(i = 0; i <= (Object.keys(freshData.properties).length - 1); ++i)
			{
				var pName = Object.keys(freshData.properties)[i];
				var pValue = freshData.properties[pName];
				if(typeof(pValue) == "number") // Determine if a number or string, and subsequently set the number box as checked or not.
				{
					isNum = "checked";
				}
				else
				{
					isNum = "";
				}
				$('#propertyTable').append('<tr class="relationProperty"><td><input type="text" class="propertyLabel" value="' + htmlspecialchars(pName) + '" /></td> <td><input type="text" class="propertyValue" value="' + htmlspecialchars(pValue) + '" /></td> <td><input type="checkbox" class="propertyType" ' + isNum + ' /></td> <td><input type="button" value="-" onclick="$(this).parent().parent().remove();" /></td></tr>');
			}
		}
	}
	$('#propertyTable').append('<tr class="relationProperty"><td><input type="text" class="propertyLabel" /></td> <td><input type="text" class="propertyValue" /></td> <td><input type="checkbox" class="propertyType" /></td> <td><input type="button" value="-" onclick="$(this).parent().parent().remove();" /></td></tr>');
	$('#propertyTable').append('</table>')
}

function relationToNeo4j(workingData, relationId)
{
	var updatedData = new Object();

	// Get the properties
	var relProperties = new Object()
	$('.relationProperty').each(
		function()
		{
			pLabel = $(this).find('.propertyLabel').val();
			pValue = $(this).find('.propertyValue').val();
			isNum = $(this).find('.propertyType').is(':checked');

			if(pLabel != "" & pValue != "") // If either are empty, don't add them
			{
				if(isNum & !isNaN(parseFloat(pValue))) // If it's a number..
				{
					relProperties[pLabel] = parseFloat(pValue);
				}
				else // Store it as a string
				{
					relProperties[pLabel] = pValue;
				}
			}
		}
	);

	if(relationId === undefined) // Brand new relation
	{
		workingData.properties = relProperties;

		$.ajax('neo4jProxy.php?action=addRelation',
			{
				type: 'POST',
				async: false,
				dataType:	'json',
				data:
					{
						relationData: JSON.stringify(workingData)
					},
				success:
					function(returnData, textStatus, jqXHR)
					{
						updatedData = returnData;
					}
			}
		);
	}
	else // Update existing relation
	{
		$.ajax('neo4jProxy.php?action=updateRelation',
			{
				type: 'POST',
				async: false,
				dataType:	'json',
				data:
					{
						relationId:	relationId,
						relationProperties: JSON.stringify(relProperties)
					},
				success:
					function(returnData, textStatus, jqXHR)
					{
						updatedData = returnData;
					}
			}
		);
	}

	clearRelationPopup();
	return updatedData;
}

/**
 *
 * End Relation Related Functions
 *
 */
