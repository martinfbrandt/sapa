const {set, lensPath, assocPath, merge, view} = require('ramda');

module.exports.mergeAtPath = (path, origObj, insertObj) =>
 set(lensPath(path), 
     merge(view(lensPath(path), origObj), insertObj), 
       origObj); 

module.exports.addJsonHeaders = otherHeaders => assocPath(['headers', 'content-type'], 'application/json', otherHeaders);

module.exports.addAuthHeaders = (otherHeaders, jwt) => assocPath(['headers', 'authorization'], jwt, otherHeaders)