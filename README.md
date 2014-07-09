graphNav
========
Author: Jason Gillman Jr. <jgillman@liquidweb.com>

A graphical utility to navigate and work with Neo4j databases

Getting Started
-------

### Requirements

graphNav relies on a few things. These are:

1. **PHP** - Used to talk to the Neo4j database via the use of Josh Adell's [Neo4jPHP](https://github.com/jadell/neo4jphp/) library. You'll need Apache or another httpd to facilitate this.
1. **Composer** - Handles installing the Neo4jPHP library automagically (more or less).
1. **Bower** - Handles dependency installation for the front end (JavaScript) libraries ([vis.js](https://github.com/almende/vis), [jQuery](http://jquery.com), and [jQuery UI](http://jqueryui.com)).


### Setup / Configuration

As mentioned, you'll need Composer and Bower to handle the front and back end dependencies. Once complete, the rest is easy:

1. `composer install`
1. `bower install`
1. Edit `hostInfo.php` to reflect the proper location and port of the Neo4j database you would like to use

**Alternatively**
If you use docker, there is an image. Take a look [here](https://registry.hub.docker.com/u/jgillmanjr/graphnav/)

### Usage
Point your browser to index.html to load up the app. At this point, you'll see the canvas, a button to refresh the graph, and a selection box to filter nodes by label (as well as their directly connected nodes).
If you have any data in Neo4j, it will automatically populate (assuming graphNav is communicating properly with the database).

For the most part, usage is pretty self explanitory. To get to the tools, hit the `Edit` button up top. From here you can create, edit, and delete nodes and relations.

**Assorted Usage Notes and Known Issues**

1. When assigning properties to nodes and relations, there will be a select box to indicate if the property value should be treated as a number. If number is selected, an attempt will be made to parse the value as a float. If it's an integer, it's not a big deal since Neo4j will get just get the integer value. If it can't parse it as a float and the property is a scalar, it will be passed in as a string. However, if the property is an array, and one of the elements can't be parsed as a number, that whole property will be removed and the node will still continue to be saved. Be careful.
1. In order to edit a relation, you will need to drag one of the ends around, whether it lands on the same node or another one it doesn't matter since the relation sticks with the same start and end nodes ultimately. This is just to get the popup to activate. If you edit a node and the relation looks wonky, just hit the `Refresh Graph` button.
1. If the graph goes wonky due to resizing the window, for example, just hit the `Refresh Graph` button.
1. Hit `Refresh Graph` if you want to filter by label. Multiple labels can be selected, and displayed, in a 'tag' like format.
1. Currently, if a property is going to be an array of strings, there are a few key things to note:
	1. Commas can't be used currently in an array value. It will signal the end of a "tag" to tag-it (how array properties are being handled interface wise). I am working on determining the best way to resolve this.
	1. If you want to use double quotes as the first and/or last character(s) of an array value, you'll need to enter them twice, otherwise they will get tossed. If they are in the middle, however, they will be fine as is.
	1. **THIS IS IMPORTANT** As mentioned earlier, if you specify that the values of an array are going to be numbers, the whole property will get tossed if **any** of the values can't be parsed as a number and the node will still be saved. Basically, you WILL lose the data. I am working on determining the best way to go about handling inadvertant mixed types in arrays...

To Do
-----

This project is in its infancy. There is much to do and to be fixed.

Take a look at the [To Do List](https://github.com/jgillmanjr/graphNav/issues/2).
