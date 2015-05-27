var path = require('path')
var async = require('async')

var createDatabases = require('./lib/create-dbs')
var configureDatabases = require('./lib/configure-dbs')
var pushDocs = require('./lib/push-docs')

module.exports = function(url, source, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  source = path.resolve(process.cwd(), source)
  options = options || {}

  async.series({
    'create databases': createDatabases.bind(this, url, source, options),
    'configure databases': configureDatabases.bind(this, url, source, options),
    'deploy documents': pushDocs.bind(this, url, source, options)
  }, callback)
}
