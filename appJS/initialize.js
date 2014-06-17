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
			 nodeAction('new');
		},
		onConnect: function(data, callback)
		{
			if(data.from == data.to)
			{
				alert("It appears you're trying to create a relation to the same node.\n\nCurrently, you can't select the link within graphNav to delete it (you'll need to remove it from Neo4j manually)\n\nIf this is in error, please cancel out of the operation when you get the popup.");
			}
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
					deleteNodes(data.nodes);
				}
			}
		},
		onEdit: function(data, callback)
		{
			nodeAction('edit', data.id, callback);
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
