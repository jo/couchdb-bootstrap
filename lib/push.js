var push = require('couchdb-push')
var async = require('async')
var utils = require('./utils')
var internals = ['_users', '_replicator']

module.exports = function (couch, source, options, callback) {
  options.concurrency = 'concurrency' in options ? options.concurrency : 100
  options.index = 'index' in options ? options.index : true

  function loader (filenames, cb) {
    async.map(filenames, function (filename, done) {
      var dbname = utils.mapDbName(filename, options)
      var db = couch.use(dbname)

      utils.docs(filename, function (error, filenames) {
        if (error) return done(error)

        async.mapLimit(filenames, options.concurrency, function (filename, next) {
          push(db, filename, options, next)
        }, utils.groupByDatabase(dbname, done))
      })
    }, utils.reduceGroupedResult(cb))
  }

  utils.dbs(source, function (error, filenames) {
    if (error) return callback(error)
    var filenamesGruped = filenames
        .reduce(function (b, c) {
          var filename = utils.mapDbName(c, options)
          b[(internals.indexOf(filename) === -1) ? 'filtered' : 'internals'].push(c)
          return b
        }, {filtered: [], internals: []})
    loader(filenamesGruped.filtered, function () {
      loader(filenamesGruped.internals, callback)
    })
  })
}
