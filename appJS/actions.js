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

function createNode()
{
	// Get the properties
	var nodeProperties = new Object()
	$('.nodeProperty').each(
		function()
		{
			pLabel = $(this).find('.propertyLabel').val();
			pValue = $(this).find('.propertyValue').val();

			if(pLabel != "" & pValue != "") // If either are empty, don't add them
			{
				nodeProperties[pLabel] = pValue;
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

	// Create the node in Neo4j
	$.ajax('neo4jProxy.php?action=addNode',
		{
			type: 'POST',
			async: true,
			dataType:	'json',
			data:
				{
					nodeProperties: JSON.stringify(nodeProperties),
					nodeLabels:		JSON.stringify(nodeLabels)
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

function editNode(workingData,callback)
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
					nodeId: workingData.id
				},
			success:
				function(returnData, textStatus, jqXHR)
				{
					freshData = returnData;
				}
		}
	);

	var nodePopDialog = $('#nodePopup').dialog(
		{
			dialogClass: "no-close",
			height: 300,
			width: 600,
			title: "Editing Node: " + freshData.id,
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
							$(nodePopDialog).append('<span class="nodeProperty">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
						}
				},
				{
					text: "Save",
					click: function()
						{
							callback(updateNode(freshData.id));
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
	if(freshData.neo4jLabels != null) // Null check
	{
		for(i = 0; i <= (freshData.neo4jLabels.length - 1); ++i)
		{
			$(nodePopDialog).append('<span class="nodeLabel"><input type="text" class="labelValue" value="' + freshData.neo4jLabels[i] + '" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
		}
	}
	$(nodePopDialog).append('<span class="nodeLabel"><input type="text" class="labelValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');

	$(nodePopDialog).append('<span id="nodePropsHeader">Node Properties</span><br />');
	if(Object.keys(freshData.properties).length > 0)
	{
		for(i = 0; i <= (Object.keys(freshData.properties).length - 1); ++i)
		{
			var pName = Object.keys(freshData.properties)[i];
			var pValue = freshData.properties[pName];
			$(nodePopDialog).append('<span class="nodeProperty">Name: <input type="text" class="propertyLabel" value="' + pName + '" /> Value: <input type="text" class="propertyValue" value="' + pValue + '" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
		}
	}
	$(nodePopDialog).append('<span class="nodeProperty">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
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
							$(nodePopDialog).append('<span class="nodeProperty">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
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

	$(nodePopDialog).append('<span id="nodeLabelHeader">Node Labels</span><br />');
	$(nodePopDialog).append('<span class="nodeLabel"><input type="text" class="labelValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
	$(nodePopDialog).append('<span id="nodePropsHeader">Node Properties</span><br />');
	$(nodePopDialog).append('<span class="nodeProperty">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
}


function updateNode(nodeId)
{
	var updatedData = new Object();

	// Get the properties
	var nodeProperties = new Object()
	$('.nodeProperty').each(
		function()
		{
			pLabel = $(this).find('.propertyLabel').val();
			pValue = $(this).find('.propertyValue').val();

			if(pLabel != "" & pValue != "") // If either are empty, don't add them
			{
				nodeProperties[pLabel] = pValue;
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

	// Create the node in Neo4j
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
					/*
					data.nodes.data[returnData.id].label = returnData.label;
					data.nodes.data[returnData.id].title = returnData.title;
					data.nodes.data[returnData.id].neo4jLabels = returnData.neo4jLabels;
					data.nodes.data[returnData.id].properties = returnData.properties;
					*/
					updatedData = returnData;
				}
		}
	);

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
							$(relationPopDialog).append('<span class="relationProperty">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
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
									
									if(pLabel != "" & pValue != "") // If either are empty, don't add them
									{
										relProperties[pLabel] = pValue;
									}
								}
							);

							workingData.properties = relProperties;

							if(workingData.type == "")
							{
								alert("You must specify a relation type.");
							}
							else
							{
								createRelation(workingData);
							}
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
	$(relationPopDialog).append('<span id="relationPropsHeader">Relation Properties</span><br />');
	$(relationPopDialog).append('<span class="relationProperty">Name: <input type="text" class="propertyLabel" /> Value: <input type="text" class="propertyValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
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
/**
 *
 * End Relation Related Functions
 *
 */
