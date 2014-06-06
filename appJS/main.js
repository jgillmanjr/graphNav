/**
 * Application Specific JS
 * Jason Gillman Jr. <jason@rrfaae.com>
 */

// Setup graph stuff
//var container = $('#bigBoard').get(); // Figure out how to get this to work with jQuery selects
var container = document.getElementById('bigBoard');
var options =
	{
		width: '1280px',
		height: '1024px',
		dataManipulation:
		{
			enabled: true
		}
	};
var data = {};

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

