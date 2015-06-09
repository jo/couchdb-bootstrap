var push = require('couchdb-push')
var path = require('path')
var async = require('async')
var utils = require('./utils')

module.exports = function(url, source, options, callback) {
  utils.dbs(source, function(error, filenames) {
    if (error) return callback(error)

    async.map(filenames, function(filename, done) {
      var dbname = path.basename(filename)
      var db = url + '/' + dbname

      utils.docs(filename, function(error, filenames) {
        if (error) return done(error)

        async.map(filenames, function(filename, next) {
          push(db, filename, options, next)
        }, utils.groupByDatabase(dbname, done))
      })
    }, utils.reduceGroupedResult(callback))
  })
}
