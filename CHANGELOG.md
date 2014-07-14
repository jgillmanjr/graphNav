Changelog
=========
## Version 0.6.0

## New Capabilities
1. Can now freeze the physics simulation. Good for positioning those nodes exactly where you want them. Note that the links may not work out exactly like you may want though. Some actions, such as enabling editing features, will turn the simulation modeling back on. Not superdependable.

### Fixes / Tweaks
1. Updates to account for some changes made in the 3.0.0 release of the vis.js library. The `Graph` class has been renamed to `Network`
1. `Refresh Graph` button moved to the end

### To Do
1. Boolean support. I'm deciding the best way to handle this..

-----------------------------------

## Version 0.5.0

### New Capabilities
1. Arrays of string and number types can be used (remember, no mixing of types, at least for now, as per the [Neo4j documentation](http://docs.neo4j.org/chunked/stable/rest-api-property-values.html#_arrays))

### Fixes / Tweaks
1. Refactoring of how property fields are generated. Same code is now used as part of existing property generation
1. Additionally created property fields added to top now
1. Updated documentation

### To Do
1. Boolean support. I'm deciding the best way to handle this..

-----------------------------------

## Version 0.4.1

### Fixes / Tweaks
1. Serious refactoring so that node and relation operations can use as much of the same code as possible. This will make life better when working on adding support for additional data types (such as booleans and arrays)

-----------------------------------

## Version 0.4.0

### New Capabilities
1. Can clone nodes by selecting the one you want to clone, clicking `Edit Node` and clicking the `Clone` button. For convenience, the popup will remain up so multiple clones can be made with ease.

Note that for clones, if there is a change in any of the properties or labels, those will be propogated to the cloned nodes (which may actually be a benefit)

-----------------------------------

## Version 0.3.0

### New Capabilities
1. Node Filtering based on label
1. Can specify that a property value should attempt to be treated as a number

### Fixes / Tweaks
1. `Refresh Graph` button and the `Filter by labels` selection box are now next to the graph as compared to above it

-----------------------------------

## Version 0.2.0

### New Capabilities
1. Edit relations
1. Remove self referencing relations

### Fixes / Tweaks
1. Adjusted layout of properties when creating or editing nodes or relations

-----------------------------------

## Version 0.1.0

Initial release with basic functionality.

### Capabilities
1. Add, edit, delete nodes.
1. Add and delete relations.
1. Assign labels and properties to nodes.
1. Assign types and properties to relations.
1. Refresh the graph - both to get new data as well as redraw the graph if window size/layout changes.

### To Do
1. Allow for removal of self referencing relations (nodes related to themselves). Awaiting release of updated vis.js so that these edges can be selected.
1. Edit relations. This is currently a limitation of the vis.js library - still need to put in a request for that.
