var push = require('couch-push')
var path = require('path')
var glob = require('glob')
var async = require('async')

var DOCS = '{_users,[^_]*/_design/*,[^_]*/_local/*,[^_]*/[^_]*}'

module.exports = function pushDocs(url, source, options, callback) {
  glob(path.join(source, DOCS), function(error, filenames) {
    console.log('yeah', error, filenames)
    
    if (error) return callback(error)

    async.map(filenames, function(filename, next) {
      var dbname = path.basename(filename)

      push(url + '/' + dbname, filename, options, next)
    }, callback)
  })
}
