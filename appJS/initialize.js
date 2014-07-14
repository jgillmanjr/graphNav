/**
 * Grab initial data and create the graph
 * Jason Gillman Jr. <jason@rrfaae.com>
 */

// Setup graph stuff
var container = $('#bigBoard').get(0);

var data =
	{
		nodes: new vis.DataSet(),
		edges: new vis.DataSet()
	};

var options =
	{
		width: '75%',
		height: '75%',
		dataManipulation: true,
		onAdd: function(data, callback)
		{
			data.callback	=	function(updatedData){window.data.nodes.add(updatedData);};
			objectAction('node', 'new', data);
		},
		onConnect: function(data, callback)
		{
			data.callback	=	callback;
			objectAction('relation', 'new', data);
		},
		onDelete: function(data, callback)
		{
			if(data.nodes.length == 0) // Empty nodes array == deleting an edge. At least that's what it seems like.
			{
				deleteRelations(data.edges);
			}
			else
			{
				if(data.edges.length != 0) // Throw the warning that you can't delete nodes with relations in Neo4j
				{
					alert('You must remove relations before removing nodes');
				}
				else
				{
					deleteNodes(data.nodes);
				}
			}
		},
		onEdit: function(data, callback)
		{
			data.callback	=	callback;
			objectAction('node', 'edit', data);

		},
		onEditEdge: function(data, callback)
		{
			data.callback	=	callback;
			data.label		=	window.data.edges._data[data.id].label;
			objectAction('relation', 'edit', data);
		}
	};

/**
 *
 * Load data from Neo4j
 *
 */
$.ajax('neo4jProxy.php?action=retrieveAll',
	{
		type: 'GET',
		async: true,
		dataType:	'json',
		success:
			function(returnData, textStatus, jqXHR)
			{
				data.nodes.add(returnData.nodes);
				data.edges.add(returnData.edges);
			}
	}
);

filterLabels();

/**
 * Setup trigger for freezing the simulation
 */
$('#togglePhysics').on('click',
		function()
		{
			if(graph.freezeSimulation)
			{
				graph.freezeSimulation = false;
			}
			else // Enable
			{
				graph.freezeSimulation = true;
			}
		}
	);

var graph = new vis.Network(container, data, options);
