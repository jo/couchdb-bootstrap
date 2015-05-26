var path = require('path')
var async = require('async')

var pushDocs = require('./lib/push-docs')

module.exports = function(url, source, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  options = options || {}
  
  source = path.resolve(process.cwd(), source)

  pushDocs(url, source, options, callback)
}
