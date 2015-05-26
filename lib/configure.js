var nano = require('nano')
var path = require('path')
var async = require('async')
var utils = require('./utils')

module.exports = function configure(url, source, options, callback) {
  var couch = nano(url)

  utils.config(source, function(error, filename) {
    if (error) return callback(error)
    if (!filename) return callback()
      
    var json = require(filename)
    
    var settings = Object.keys(json)
      .reduce(function(memo, key) {
        var section = Object.keys(json[key])
          .map(function(k) {
            return {
              path: encodeURIComponent(key) + '/' + encodeURIComponent(k),
              value: json[key][k]
            }
          })

        return memo.concat(section)
      }, [])

    async.map(settings, function(setting, next) {
      couch.request({
        method: 'PUT',
        path: '_config/' + setting.path,
        body: setting.value
      }, next)
    }, callback)
  })
}
