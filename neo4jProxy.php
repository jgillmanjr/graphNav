<?php
	require('hostInfo.php');
	require('vendor/autoload.php');
	use Everyman\Neo4j;

	$neo4jClient = new Neo4j\Client($host, $port);

	if($_GET['action'] == 'retrieveAll') // Get ALL the nodes and relations, and then return them JSON style for consumption by graphNav
	{
		$queryString = 'MATCH n ' . 'OPTIONAL MATCH n-[r]-o ' . 'RETURN id(n) AS startId, n AS startNode, id(r) AS relationId, r AS relation, id(o) AS endId, o AS endNode';
		$query = new Neo4j\Cypher\Query($neo4jClient, $queryString);
		$result = $query->getResultSet();

		$usedNodeIds = array(); // Initialize
		$usedRelationIds = array(); // Initialize
		$returnArray['nodes'] = array(); // Initialize
		$returnArray['edges'] = array(); // Initialize
		
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
				foreach($startNode->getProperties() as $property => $value)
				{
					$title .= "<b>$property:</b> $value <br>";
				}

				if(isset($startNode->getProperties()['name']))
				{
					$label = $startNode->getProperty('name');
				}
				else
				{
					$label = (string)$startId; // Apparently, vis.js doesn't like it if the label is not a string
				}

				$returnArray['nodes'][] = array('id' => $startId, 'label' => $label, 'title' => $title, 'properties' => $startNode->getProperties());
				$usedNodeIds[] = $startId;
				unset($title);
			}

			if(is_a($relation,'Neo4j\Relationship'))
			{
				if(!in_array($endId, $usedNodeIds))
				{
					foreach($endNode->getProperties() as $property => $value)
					{
						$title .= "<b>$property:</b> $value <br>";
					}

					if(isset($endNode->getProperties()['name']))
					{
						$label = $endNode->getProperty('name');
					}
					else
					{
						$label = (string)$endId;
					}

					$returnArray['nodes'][] = array('id' => $endId, 'label' => $endNode->getProperty('name'), 'title' => $title, 'properties' => $endNode->getProperties());
					$usedNodeIds[] = $endId;
					unset($title);
				}

				if(!in_array($relationId, $usedRelationIds)) // More than one identical relation doesn't break vis.js, but it doubles up the connections (though it does look kind of neat)
				{
					$returnArray['edges'][] = array('from' => $startId, 'to' => $endId, 'id' => $relationId);
					$usedRelationIds[] = $relationId;
				}
			}
		}
		echo json_encode($returnArray);
	}

	if($_GET['action'] == 'addNode')
	{
		$nodeProperties = json_decode($_POST['nodeProperties'], TRUE);

		$newNode = $neo4jClient->makeNode();
		$newNode->setProperties($nodeProperties)->save();

		$returnArray['id'] = $newNode->getId();
		$returnArray['properties'] = $nodeProperties;
		if(isset($returnArray['properties']['name']))
		{
			$returnArray['label'] = $returnArray['properties']['name'];
		}
		else
		{
			$returnArray['label'] = "Node ID: " . (string)$newNode->getId();
		}

		foreach($returnArray['properties'] as $property => $value)
		{
			$title .= "<b>$property:</b> $value <br>";
		}
		$returnArray['title'] = $title;

		echo json_encode($returnArray);
	}
?>
