var path = require('path')
var async = require('async')

var configure = require('./lib/configure')
var createDatabases = require('./lib/create-databases')
var secure = require('./lib/secure')
var pushDocs = require('./lib/push-docs')

module.exports = function(url, source, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  source = path.resolve(process.cwd(), source)
  options = options || {}

  async.series({
    'configure': configure.bind(this, url, source, options),
    'create databases': createDatabases.bind(this, url, source, options),
    'setup database securities': secure.bind(this, url, source, options),
    'deploy documents': pushDocs.bind(this, url, source, options)
  }, callback)
}
