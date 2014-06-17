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

### Start Using
At this point, point your browser to index.html and enjoy!

To Do
-----

This project is in its infancy. There is much to do and to be fixed.

Take a look at the [To Do List](https://github.com/jgillmanjr/graphNav/issues/2).
