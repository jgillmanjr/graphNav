/**
 * Action Code
 * Jason Gillman Jr. <jason@rrfaae.com>
 */

 /**
 *
 * Miscellanious / Common Functions
 *
 */

function clearPopup()
{
	$('#actionPopup').dialog("destroy");
	$('#actionPopup').empty();
}

function filterLabels()
{
	/**
	*
	* Get labels for filtering
	*
	*/

	$('#labelFilter').empty(); // Clear out if previously populated

	$.ajax('neo4jProxy.php?action=listLabels',
		{
			type: 'GET',
			async: true,
			dataType:	'json',
			success:
				function(returnData, textStatus, jqXHR)
				{
					for(i = 0; i <= (returnData.length - 1); ++i)
					{
						$('#labelFilter').append('<option value="' + htmlspecialchars(returnData[i]) + '">' + returnData[i] + '</option>');
					}
				}
		}
	);

	$('#labelFilter').select2({width: '150px'});
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
 * Makes things happen
 * 
 * type is either `node` or `relation`
 * action is `new` or `edit`
 * data is going to be mixed
 *
 */
function objectAction(type, action, data)
{
	/**
	 * Dialog initialization and buildout
	 */
	var actionDialog = $('#actionPopup').dialog(
		{
			dialogClass:	"no-close",
			height:			400,
			width:			700
		}
	);

	/**
	 * Anonymous function to add property fields
	 */
	var propAddFunc = function(pName, pValue)
		{
			var typeOpts;
			typeOpts = '<option value="string">String</option>';
			typeOpts += '<option value="number">Number</option>';
			typeOpts += '<option value="boolean">Boolean</option>';

			if(pName === undefined) // I'm lazy, so I'm only doing a test against the name. I don't see how a property value could be passed in w/o name, but if there's an issue, will address..
			{
				var pName	=	""; // Define it as blank
				var pValue	=	""; 
			}

			$('#propertyTable').append('<tr class="property"><td><input type="text" class="propertyLabel" value="' + htmlspecialchars(pName) + '" /></td><td><input type="text" class="propertyValue" value="' + htmlspecialchars(pValue) + '"/></td><td><input type="checkbox" class="isArray" /></td><td><select class="propType">' + typeOpts + '</select></td><td><input type="button" value="-" onclick="$(this).parent().parent().remove();" /></td></tr>');

			/**
			 * Type Checking and appropriate actions based on such
			 */
			if(pName !== undefined) // Only check if getting passed in property
			{
				var propType = typeof(pValue);
				$('.property').last().children('td').find('.propType').val(propType);
			}
		}

	/**
	 * Skeleton code for making things happen in neo4j
	 */
	var toNeo4j	=	function(clone)
		{
			var proxyData = new Object(); // This will be used to feed into the data section of the ajax call

			/**
			 * Get the properties
			 */
			var properties	=	new Object();
			$('.property').each(
				function()
				{
					pLabel = $(this).find('.propertyLabel').val();
					pValue = $(this).find('.propertyValue').val();
					isNum = $(this).find('.propertyType').is(':checked');

					if(pLabel != "" & pValue != "") // If either are empty, don't add them
					{
						if(isNum & !isNaN(parseFloat(pValue))) // If it's a number..
						{
							properties[pLabel] = parseFloat(pValue);
						}
						else // Store it as a string
						{
							properties[pLabel] = pValue;
						}
					}
				}
			);

			proxyData.properties	=	JSON.stringify(properties);

			/**
			 * Determine the target and work the specifics
			 */
			if(type == 'node')
			{
				/**
				 * Get labels (if any)
				 */
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

				proxyData.nodeLabels	=	JSON.stringify(nodeLabels);

				if(action == 'new' || clone !== undefined) // For new or cloned nodes
				{
					saveAction	=	'addNode';
				}
				else
				{
					saveAction			=	'updateNode';
					proxyData.id		=	data.id;
				}
			}
			else // Relation
			{
				if(action == 'new')
				{
					saveAction =	'addRelation';
					proxyData.from	=	data.from;
					proxyData.to	=	data.to;
					proxyData.type	=	$('#relationType').val();
				}
				else
				{
					saveAction		=	'updateRelation';
					proxyData.id	=	data.id;
				}
			}

			$.ajax('neo4jProxy.php?action=' + saveAction,
				{
					type:		'POST',
					async:		false,
					dataType:	'json',
					data:		proxyData,
					success:
						function(returnData, textStatus, jqXHR)
						{
							updatedData = returnData;
						}
				}
			);

			data.callback(updatedData);
			filterLabels();

			if(clone === undefined) // Don't close the popup if node cloning occurs
			{
				clearPopup();
			}
		}

	/**
	 * Buttons that will be common for all types and actions
	 */
	var buttons =
	[
		{
			text: "Add Property",
			click: function()
				{
					propAddFunc();
				}
		},
		{
			text: "Save",
			click: function(){toNeo4j();}
		},
		{
			text: "Cancel",
			click: function()
				{
					clearPopup();
				}
		}
	];

	/**
	 * Property Elements (Common to all types and actions as well)
	 */
	$(actionDialog).append('<span id="propsHeader"><br />Properties<br /></span>');
	$(actionDialog).append('<table id="propertyTable"><tr id="propColHeader"><th>Property Name</th><th>Property Value</th><th>Array</th><th>Type</th><th>Remove Property</th></tr>');
	propAddFunc();
	$('#propertyTable').append('</table>');

	/**
	 * All Node Specific Stuff
	 */
	if(type == 'node')
	{
		buttons.unshift(
			{
				text: "Add Label",
				click: function()
					{
						$('#propsHeader').before('<span class="nodeLabel"><input type="text" class="labelValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>'); // So it goes before the property header
					}
			}
		);

		$('#propsHeader').before('<span id="nodeLabelHeader">Node Labels<br /></span>');
		$('#nodeLabelHeader').after('<span class="nodeLabel"><input type="text" class="labelValue" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
	}

	/**
	 * All Relation Specific Stuff
	 */
	if(type == 'relation')
	{
	}

	/**
	 * New Object Specific Stuff
	 */
	if(action == 'new')
	{
		if(type == 'node') // Generate this if node
		{
			title = 'Create New Node';
		}
		else // Generate this if relation
		{
			title = 'Create New Relation';
			$('#propsHeader').before('<span id="relationHeader">Making relation from node ID ' + data.from + ' to node ID ' + data.to + '<br /><br /></span>');
			$('#relationHeader').after('<span id="relationTypeField">Relation Type: <input type="text" id="relationType" /><br /></span>');
		}
	}

	/**
	 * Edit Object Specific Stuff
	 */
	if(action == 'edit')
	{
		if(type == 'node') // Generate this if node
		{
			title = 'Editing Node: ' + data.id;
			var targetAction	=	'loadNode';
			var proxyData		=	{nodeId:	data.id};

			/**
			 * Clone Button
			 */
			buttons.unshift(
				{
					text: "Clone Node",
					click: function()
						{
							toNeo4j(true); // "define" the clone parameter so addNode gets run
						}
				}
			);
		}
		else // Generate this if relation
		{
			title = 'Editing Relation: ' + data.id;
			var targetAction = 'loadRelation';
			var proxyData		=	{relationId:	data.id};
			$(actionDialog).prepend('<span id="relationType">Relation Type: ' + htmlspecialchars(data.label) + '<br /></span>');
		}

		/**
		 * Pull Existing Data from Neo4j in the off chance what is loaded is stale
		 */
		var freshData = new Object();

		$.ajax('neo4jProxy.php?action=' + targetAction,
			{
				type:		'POST',
				async:		false,
				dataType:	'json',
				data:		proxyData,
				success:
					function(returnData, textStatus, jqXHR)
					{
						freshData = returnData;
					}
			}
		);

		/**
		 * Load Labels if appropriate
		 */
		if(freshData.neo4jLabels != null) // Null check
		{
			for(i = 0; i <= (freshData.neo4jLabels.length - 1); ++i)
			{
				$('#nodeLabelHeader').after('<span class="nodeLabel"><input type="text" class="labelValue" value="' + htmlspecialchars(freshData.neo4jLabels[i]) + '" /><input type="button" value="-" onclick="$(this).parent().remove();" /><br /></span>');
			}
		}

		/**
		 * Load Existing Properties
		 */
		if(Object.keys(freshData.properties).length > 0)
		{
			for(i = 0; i <= (Object.keys(freshData.properties).length - 1); ++i)
			{
				var pName = Object.keys(freshData.properties)[i];
				var pValue = freshData.properties[pName];
				propAddFunc(pName, pValue);
			}
		}
	}

	/**
	 * Finish the buildout
	 */
	$(actionDialog).dialog("option", "buttons", buttons);
	$(actionDialog).dialog("option", "title", title);
}

function refreshGraph()
{
	data.edges.clear();
	data.nodes.clear();

	if($('#labelFilter').val() === null) // No labels selected to filter on
	{
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
	else // Refresh the graph displaying only nodes with the selected properties as well as nodes directly related
	{
		$.ajax('neo4jProxy.php?action=retrieveByLabel',
			{
				type: 'POST',
				async: false,
				dataType:	'json',
				data:
					{
						labels: JSON.stringify($('#labelFilter').val())
					},
				success:
					function(returnData, textStatus, jqXHR)
					{
						data.nodes.add(returnData.nodes);
						data.edges.add(returnData.edges);
					}
			}
		);
	}

	graph.redraw();
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

					filterLabels(); // Update labels that can be filtered in the event you just deleted the last node to use a label
				}
		}
	);
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
