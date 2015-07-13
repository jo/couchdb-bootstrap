var path = require('path')
var async = require('async')
var nanoOption = require('nano-option')

var configure = require('./lib/configure')
var secure = require('./lib/secure')
var push = require('./lib/push')

module.exports = function(url, source, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  var couch = nanoOption(url)
  source = path.resolve(process.cwd(), source)
  options = options || {}

  async.series({
    configure: configure.bind(this, couch, source, options),
    secure: secure.bind(this, couch, source, options),
    push: push.bind(this, couch, source, options)
  }, callback)
}
