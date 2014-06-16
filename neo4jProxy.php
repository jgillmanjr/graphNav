<?php
	require('hostInfo.php');
	require('vendor/autoload.php');
	use Everyman\Neo4j;

	function generateTitle(Everyman\Neo4j\PropertyContainer $neo4jObject)
	{
		if(is_a($neo4jObject,'Everyman\Neo4j\Node')) // Dealing with a node object
		{
			$title .= "<b>Labels</b><br />";
			if(count($neo4jObject->getLabels()) == 0)
			{
				$title .= "Node has no labels<br />";
			}
			else // We have labels
			{
				foreach($neo4jObject->getLabels() as $neo4jLabel)
				{
					//$title .= $neo4jLabel . "<br />"; <-- I have a pull request in that will allow this to be used
					$title .= $neo4jLabel->getName() . "<br />";
				}
			}

			$title .= "<br /><b>Properties</b><br />";
			if(count($neo4jObject->getProperties()) == 0)
			{
				$title .= "Node has no properties<br />";
			}
			else // Node has properties
			{
				foreach($neo4jObject->getProperties() as $property => $value)
				{
					$title .= "<b>$property:</b> $value <br />";
				}
			}
		}
		else // Dealing with a relationship object
		{
			$title .= "<b>Properties</b><br />";
			if(count($neo4jObject->getProperties()) == 0)
			{
				$title .= "Relation has no properties<br />";
			}
			else // Node has properties
			{
				foreach($neo4jObject->getProperties() as $property => $value)
				{
					$title .= "<b>$property:</b> $value <br />";
				}
			}
		}

		return $title;
	}

	/**
	 *
	 * This badboy generates the data being passed back to the browser
	 *
	 */
	function genReturnData(Everyman\Neo4j\PropertyContainer $neo4jObject)
	{
		if(is_a($neo4jObject,'Everyman\Neo4j\Node')) // Dealing with a node object
		{
			if(isset($neo4jObject->getProperties()['name']))
			{
				$label = $neo4jObject->getProperty('name');
			}
			else
			{
				$label = (string)$neo4jObject->getId(); // Apparently, vis.js doesn't like it if the label is not a string
			}

			foreach($neo4jObject->getLabels() as $neolabel)
			{
				$neo4jLabels[] = $neolabel->getName();
			}

			$return = array('id' => $neo4jObject->getId(), 'label' => $label, 'title' => generateTitle($neo4jObject), 'properties' => $neo4jObject->getProperties(), 'neo4jLabels' => $neo4jLabels);
		}
		else // Relationship object
		{
			$return = array('from' => $neo4jObject->getStartNode()->getId(), 'to' => $neo4jObject->getEndNode()->getId(), 'label' => $neo4jObject->getType(), 'id' => $neo4jObject->getId(), 'title' => generateTitle($neo4jObject), 'properties' => $neo4jObject->getProperties());
		}

		return $return;
	}

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

			if(!in_array($startId, $usedNodeIds)) // vis.js doesn't like duplicate nodes, so don't add them if already in there
			{
				$returnArray['nodes'][] = genReturnData($startNode);
				$usedNodeIds[] = $startId;
			}

			if(is_a($relation,'Everyman\Neo4j\Relationship'))
			{
				if(!in_array($endId, $usedNodeIds))
				{
					$returnArray['nodes'][] = genReturnData($endNode);
					$usedNodeIds[] = $endId;
				}

				if(!in_array($relationId, $usedRelationIds)) // More than one identical relation doesn't break vis.js, but it doubles up the connections (though it does look kind of neat)
				{
					$returnArray['edges'][] = genReturnData($relation);
					$usedRelationIds[] = $relationId;
				}
			}
		}
		echo json_encode($returnArray);
	}

	if($_GET['action'] == 'addNode')
	{
		$nodeProperties = json_decode($_POST['nodeProperties'], TRUE);
		$nodeLabels = json_decode($_POST['nodeLabels'], TRUE);

		$newNode = $neo4jClient->makeNode();
		$newNode->setProperties($nodeProperties)->save();

		if(count($nodeLabels) > 0)
		{
			foreach($nodeLabels as $label)
			{
				$labelsArray[] = $neo4jClient->makeLabel($label);
			}
			$newNode->addLabels($labelsArray);
		}

		$returnArray = genReturnData($newNode);

		echo json_encode($returnArray);
	}

	if($_GET['action'] == 'addRelation')
	{
		$relationData = json_decode($_POST['relationData'], TRUE);

		$startNode = $neo4jClient->getNode($relationData['from']);
		$endNode = $neo4jClient->getNode($relationData['to']);
		$relation = $neo4jClient->makeRelationship();

		$relation->setStartNode($startNode)->setEndNode($endNode)->setType($relationData['type'])->setProperties($relationData['properties'])->save();

		$returnArray = genReturnData($relation);

		echo json_encode($returnArray);
	}

	if($_GET['action'] == 'deleteNodes')
	{

	}

	if($_GET['action'] == 'deleteRelations')
	{
		$relationIds = json_decode($_POST['relationIds'], TRUE);

		foreach($relationIds as $relationId)
		{
			$neo4jClient->getRelationship($relationId)->delete();
		}

		echo json_encode($relationIds);
	}

	if($_GET['action'] == 'loadNode')
	{
		$nodeId = $_POST['nodeId'];

		$neo4jObject = $neo4jClient->getNode($nodeId);

		echo json_encode(genReturnData($neo4jObject));
	}

	if($_GET['action'] == 'updateNode')
	{
		$nodeId = $_POST['nodeId'];
		$nodeProperties = json_decode($_POST['nodeProperties'], TRUE);
		$nodeLabels = json_decode($_POST['nodeLabels'], TRUE);

		$neo4jObject = $neo4jClient->getNode($nodeId);

		// Clean out all existing properties
		if(count($neo4jObject->getProperties()) > 0)
		{
			foreach($neo4jObject->getProperties() as $property => $value)
			{
				$neo4jObject->removeProperty($property);
			}
		}

		// Clean out labels if exist
		if(count($neo4jObject->getLabels()) > 0)
		{
			$neo4jObject->removeLabels($neo4jObject->getLabels());
		}

		$neo4jObject->setProperties($nodeProperties)->save();

		if(count($nodeLabels) > 0)
		{
			foreach($nodeLabels as $label)
			{
				$labelsArray[] = $neo4jClient->makeLabel($label);
			}
			$neo4jObject->addLabels($labelsArray);
		}

		echo json_encode(genReturnData($neo4jObject));
	}
?>
