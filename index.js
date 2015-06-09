var path = require('path')
var async = require('async')

var configure = require('./lib/configure')
var secure = require('./lib/secure')
var push = require('./lib/push')

module.exports = function(url, source, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  source = path.resolve(process.cwd(), source)
  options = options || {}

  async.series({
    configure: configure.bind(this, url, source, options),
    secure: secure.bind(this, url, source, options),
    push: push.bind(this, url, source, options)
  }, callback)
}
