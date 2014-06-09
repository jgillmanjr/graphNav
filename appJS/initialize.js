/**
 * Application Specific JS
 * Jason Gillman Jr. <jason@rrfaae.com>
 */

// Setup graph stuff
var container = $('#bigBoard').get(0);
//var container = document.getElementById('bigBoard');

var data = {};
//var data = {nodes: [], edges: []};

var options =
	{
		width: '1280px',
		height: '1024px',
		dataManipulation: true,
		onAdd: function(data, callback)
		{
			 data.id = 3;
			 data.label = "Three";

			 var newData = {};
			 newData.id = 3;
			 newData.label = "three";
			 callback(data);
		}
	};

/**
 *
 * Load data from Neo4j
 *
 */
$.ajax('neo4jProxy.php',
		{
			type: 'GET',
			async: false,
			dataType:	'json',
			success:
				function(returnData, textStatus, jqXHR)
				{
					data.nodes = returnData.nodes;
					data.edges = returnData.edges;
				}
		}
	);

var graph = new vis.Graph(container, data, options);
