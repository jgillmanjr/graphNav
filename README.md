graphNav
========
Author: Jason Gillman Jr. <jgillman@liquidweb.com>

A graphical utility to navigate and work with Neo4j databases

Getting Started
-------

### Requirements

graphNav relies on a few things. These are:
1. **PHP** - Used to talk to the Neo4j database via the use of Josh Adell's [Neo4jPHP](https://github.com/jadell/neo4jphp/) library
1. **Composer** - Handles installing the Neo4jPHP library automagically (more or less)
1. **Bower** - Handles dependency installation for the front end (JavaScript) libraries (vis.js, jQuery, and jQuery-UI)


### Setup / Configuration

As mentioned, you'll need Composer and Bower to handle the front and back end dependencies. Once complete, the rest is easy:

1. `composer install`
1. `bower install`
1. Edit `hostInfo.php` to reflect the proper location and port of the Neo4j database you would like to use

To Do
-----

This project is in its infancy. There is much to do and to be fixed.

1. **Node Related Functionality**
	1. Edit
	1. Delete
	1. Label Support
1. **Relation Related Functionality**
	1. Edit
	1. Delete
