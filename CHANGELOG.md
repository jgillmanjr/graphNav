Changelog
=========
## Version 0.4.0

### New Capabilities
1. Can clone nodes by selecting the one you want to clone, clicking `Edit Node` and clicking the `Clone` button

## Version 0.3.0

### New Capabilities
1. Node Filtering based on label
1. Can specify that a property value should attempt to be treated as a number

### Fixes / Tweaks
1. `Refresh Graph` button and the `Filter by labels` selection box are now next to the graph as compared to above it



## Version 0.2.0

### New Capabilities
1. Edit relations
1. Remove self referencing relations

### Fixes / Tweaks
1. Adjusted layout of properties when creating or editing nodes or relations



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
