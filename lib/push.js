var push = require('couchdb-push')
var async = require('async')
var utils = require('./utils')

module.exports = function (couch, source, options, callback) {
  options.concurrency = 'concurrency' in options ? options.concurrency : 100
  options.index = 'index' in options ? options.index : true

  utils.dbs(source, function (error, filenames) {
    if (error) return callback(error)

    async.map(filenames, function (filename, done) {
      var dbname = utils.mapDbName(filename, options)
      var db = couch.use(dbname)

      utils.docs(filename, function (error, filenames) {
        if (error) return done(error)

        async.mapLimit(filenames, options.concurrency, function (filename, next) {
          push(db, filename, options, next)
        }, utils.groupByDatabase(dbname, done))
      })
    }, utils.reduceGroupedResult(callback))
  })
}
