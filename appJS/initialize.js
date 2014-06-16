/**
 * Grab initial data and create the graph
 * Jason Gillman Jr. <jason@rrfaae.com>
 */

// Setup graph stuff
var container = $('#bigBoard').get(0);
//var container = document.getElementById('bigBoard');

//var data = {};
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
			 newNode();
		},
		onConnect: function(data, callback)
		{
			newRelation(data);
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
					console.log(data.nodes);
				}
			}
		},
		onEdit: function(data, callback)
		{
			editNode(data, callback);
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

var graph = new vis.Graph(container, data, options);
