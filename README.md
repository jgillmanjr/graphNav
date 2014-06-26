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

**Assorted Usage Notes**

1. When assigning properties to nodes and relations, there will be a check box to indicate if the property value should be treated as a number. If this is checked, an attempt will be made to parse the value as a float. If it's an integer, it's not a big deal since Neo4j will get just get the integer value. If it can't parse it as a float, it will be passed in as a string.
1. Currently it's not possible to pass in arrays for properties. This is something I need to figure out the best way of handling interface wise.
1. In order to edit a relation, you will need to drag one of the ends around, whether it lands on the same node or another one it doesn't matter since the relation sticks with the same start and end nodes ultimately. This is just to get the popup to activate. If you edit a node and the relation looks wonky, just hit the `Refresh Graph` button.
1. If the graph goes wonky due to resizing the window, for example, just hit the `Refresh Graph` button.
1. Hit `Refresh Graph` if you want to filter by label. Multiple labels can be selected. Any nodes with the selected labels will show, as well as nodes that are directly connected to those nodes. To display all nodes again, just CTRL click (or COMMAND click if you're using a Mac... I think) to un-select things.

To Do
-----

This project is in its infancy. There is much to do and to be fixed.

Take a look at the [To Do List](https://github.com/jgillmanjr/graphNav/issues/2).
