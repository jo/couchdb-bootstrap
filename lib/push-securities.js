var nano = require('nano')
var path = require('path')
var async = require('async')
var utils = require('./utils')

module.exports = function pushSecurities(url, source, options, callback) {
  var couch = nano(url)

  utils.dbs(source, function(error, filenames) {
    if (error) return callback(error)
      
    async.map(filenames, function(filename, done) {
      var dbname = path.basename(filename)

      utils.security(filename, function(error, filename) {
        if (error) return done(error)
        if (!filename) return done()

        var json = require(filename)

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
