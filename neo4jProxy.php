<?php
	require('hostInfo.php');
	require('vendor/autoload.php');
	use Everyman\Neo4j;

	$neo4jClient = new Neo4j\Client($host, $port);
	// Get ALL the nodes and relations, and then return them JSON style for consumption by graphNav

	$queryString = 'MATCH n-[r]-o ' . 'RETURN id(n) AS startId, n AS startNode, id(r) AS relationId, r AS relation, id(o) AS endId, o AS endNode';
	$query = new Neo4j\Cypher\Query($neo4jClient, $queryString);
	$result = $query->getResultSet();

	$usedNodeIds = array(); // Initialize
	$usedRelationIds = array(); // Initialize
	foreach($result as $row)
	{
		$startId = $row['startId'];
		$startNode = $row['startNode'];
		$relationId = $row['relationId'];
		$relation = $row['relation'];
		$endId = $row['endId'];
		$endNode = $row['endNode'];

		if(!in_array($startId, $usedNodeIds)) // vis.js doesn't like duplicate arrays, so don't add them if already in there
		{
			$returnArray[nodes][] = array('id' => $startId, 'label' => $startNode->getProperty('name'));
			$usedNodeIds[] = $startId;
		}

		if(!in_array($endId, $usedNodeIds))
		{
			$returnArray[nodes][] = array('id' => $endId, 'label' => $endNode->getProperty('name'));
			$usedNodeIds[] = $endId;
		}

		if(!in_array($relationId, $usedRelationIds)) // More than one identical relation doesn't break vis.js, but it doubles up the connections (though it does look kind of neat)
		{
			$returnArray[edges][] = array('from' => $startId, 'to' => $endId);
			$usedRelationIds[] = $relationId;
		};
	}

	echo json_encode($returnArray);
?>
