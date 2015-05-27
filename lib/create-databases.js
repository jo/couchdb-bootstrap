var nano = require('nano')
var path = require('path')
var glob = require('glob')
var async = require('async')
var utils = require('./utils')

module.exports = function createDatabases(url, source, options, callback) {
  var couch = nano(url)

  utils.dbs(source, function(error, filenames) {
    if (error) return callback(error)

    var dbnames = filenames
      .map(function(filename) {
        return path.basename(filename)
      })
      .filter(function(dbname) {
        return dbname[0] !== '_'
      })

    async.map(dbnames, function(dbname, next) {
      couch.db.create(dbname, utils.ignoreError(utils.groupByDatabase(dbname, next), {
        ok: true,
        existing: true
      }))
    }, utils.reduceGroupedResult(callback))
  })
}
