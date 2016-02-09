var glob = require('glob')
var path = require('path')

var CONFIG = '{_config.json,_config.js,_config}'
var DBS = '{_users,_replicator,[^_]*}'
var DOCS = '{_design/*,_local/*,[^_]*}'
var SECURITY = '{_security.json,_security.js,_security}'

function singleFile (callback) {
  return function (error, filenames) {
    if (error) return callback(error)

    if (filenames.length > 1) {
      return callback({
        error: 'ambigious database configuration',
        files: filenames
      })
    }

    if (!filenames.length) {
      return callback()
    }

    callback(null, filenames[0])
  }
}

exports.config = function (source, callback) {
  glob(path.join(source, CONFIG), singleFile(callback))
}

exports.dbs = function (source, callback) {
  glob(path.join(source, DBS), callback)
}

exports.docs = function (source, callback) {
  glob(path.join(source, DOCS), callback)
}

exports.security = function (source, callback) {
  glob(path.join(source, SECURITY), singleFile(callback))
}

exports.ignoreError = function (callback, defaultResponse) {
  return function (_, response) {
    callback(null, response || defaultResponse)
  }
}

exports.groupByDatabase = function (dbname, callback) {
  return function (error, results) {
    if (error) return callback(error)

    var result = {}
    result[dbname] = results

    callback(null, result)
  }
}

exports.reduceGroupedResult = function (callback) {
  return function (error, results) {
    if (error) return callback(error)

    var result = results.reduce(function (memo, res) {
      if (typeof res !== 'object') return memo

      Object.keys(res).forEach(function (key) {
        memo[key] = res[key]
      })

      return memo
    }, {})

    callback(null, result)
  }
}

exports.mapDbName = function (filename, options) {
  var dbName = path.basename(filename)
  if (!options) return dbName
  if (typeof options.mapDbName === 'object') return options.mapDbName[dbName] || dbName
  if (typeof options.mapDbName === 'function') return options.mapDbName(dbName)

  return dbName
}
