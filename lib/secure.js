var path = require('path')
var async = require('async')
var secure = require('couchdb-secure')
var utils = require('./utils')

module.exports = function(url, source, options, callback) {
  utils.dbs(source, function(error, filenames) {
    if (error) return callback(error)
      
    async.map(filenames, function(filename, done) {
      var dbname = path.basename(filename)
      var db = url + '/' + dbname

      utils.security(filename, function(error, filename) {
        if (error) return done(error)
        if (!filename) return done()

        secure(db, filename, utils.groupByDatabase(dbname, done))
      })
    }, utils.reduceGroupedResult(callback))
  })
}
