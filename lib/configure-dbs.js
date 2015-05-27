var nano = require('nano')
var path = require('path')
var async = require('async')
var utils = require('./utils')

module.exports = function configureDatabases(url, source, options, callback) {
  var couch = nano(url)

  utils.dbs(source, function(error, filenames) {
    if (error) return callback(error)
      
    async.map(filenames, function(filename, done) {
      var dbname = path.basename(filename)

      utils.securities(filename, function(error, filenames) {
        if (error) return done(error)

        if (filenames.length > 1) {
          return done({
            error: 'ambigious database configuration',
            files: filenames
          })
        }

        if (!filenames.length) {
          return done(null)
        }

        var json = require(filenames[0])

        couch.request({
          method: 'PUT',
          db: dbname,
          path: '_security',
          body: json
        }, utils.groupByDatabase(dbname, done))
      })
    }, utils.reduceGroupedResult(callback))
  })
}
