var configure = require('couchdb-configure')
var utils = require('./utils')

module.exports = function (url, source, options, callback) {
  utils.config(source, function (error, filename) {
    if (error) return callback(error)
    if (!filename) return callback()

    configure(url, filename, callback)
  })
}
