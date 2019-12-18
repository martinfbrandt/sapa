const {set, lensPath, merge, view} = require('ramda');

module.exports.mergeAtPath = (path, origObj, insertObj) =>
 set(lensPath(path), 
     merge(view(lensPath(path), origObj), insertObj), 
       origObj); 

